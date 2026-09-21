
import express from "express";
import { z } from "zod";

const app = express();
const PORT = 3000;

app.use(express.json());

const randomPersonSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string()
      }),
      location: z.object({
        country: z.string()
      })
    })
  ).min(1)
});

app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong"
  });
});

app.get("/random-person", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");

    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to fetch random person"
      });
    }

    const data: unknown = await response.json();

    const result = randomPersonSchema.safeParse(data);

    if (!result.success) {
      return res.status(500).json({
        error: "Invalid data from external API"
      });
    }

    const person = result.data.results[0];

    return res.status(200).json({
      name: `${person.name.first} ${person.name.last}`,
      country: person.location.country
    });

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong while fetching the person"
    });
  }
});

const userSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).optional().default(28),
  email: z.string().trim().toLowerCase().email()
});

app.post("/users", (req, res) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Invalid user data",
      details: result.error.issues
    });
    return;
  }

  res.status(201).json(result.data);
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});