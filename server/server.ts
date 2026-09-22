
import express from "express";
import { z } from "zod";

const app = express();
const PORT = 3000;

app.use(express.json());

// Skill 1 - Ping

app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong"
  });
});

// Skill 2 - Random Person

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

app.get("/random-person", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");

    if (!response.ok) {
      res.status(500).json({
        error: "Failed to fetch random person"
      });
      return;
    }

    const data: unknown = await response.json();
    const result = randomPersonSchema.safeParse(data);

    if (!result.success) {
      res.status(500).json({
        error: "Invalid data from external API"
      });
      return;
    }

    const person = result.data.results[0];

    res.status(200).json({
      name: `${person.name.first} ${person.name.last}`,
      country: person.location.country
    });

  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while fetching the person"
    });
  }
});

// Skill 3 - User Signup

const userSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).default(28),
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

// Skill 4 - Random Login

const randomLoginSchema = z.object({
  results: z.array(
    z.object({
      login: z.object({
        username: z.string().min(1)
      }),
      registered: z.object({
        date: z.iso.datetime({ offset: true })
      })
    })
  ).min(1)
});

app.get("/random-login", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");

    if (!response.ok) {
      res.status(500).json({
        error: "Failed to fetch login data"
      });
      return;
    }

    const data: unknown = await response.json();
    const result = randomLoginSchema.safeParse(data);

    if (!result.success) {
      res.status(500).json({
        error: "Invalid login data from external API"
      });
      return;
    }

    const user = result.data.results[0];

    const username = user.login.username;
    const registeredDate = user.registered.date.split("T")[0];

    res.status(200).json({
      username,
      registeredDate,
      summary: `${username} (registered on ${registeredDate})`
    });

  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while fetching login data"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});