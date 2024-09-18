require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());
app.use(cors());

// REGISTER USER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  try {
    const check = await prisma.user.findUnique({
      where: { username: username },
    });
    if (check) {
      return res.status(400).json({ error: "This user already exists" });
    }
    await prisma.user.create({
      data: {
        username: username,
        password: password,
      },
    });
    return res.status(201).json({ message: "User Created" });
  } catch (error) {
    throw error;
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Missing username or password" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (password != user.password) {
      return res.status(400).json({ error: "Incorrect Password" });
    }
    return res.status(200).json({ message: "Login Ok" });
  } catch (error) {
    throw error;
  }
});

// SAVE LOCATION INFORMATION
app.post("/saveDetails", async (req, res) => {
  const {
    distance,
    lat1,
    lon1,
    lat2,
    lon2,
    note,
    ownerName,
    destination,
    origin,
  } = req.body.data;
  try {
    console.log(req.body.data);
    await prisma.location.create({
      data: {
        distance: distance,
        lat1: lat1,
        lat2: lat2,
        lon1: lon1,
        lon2: lon2,
        note: note,
        ownerName: ownerName,
        destination: destination,
        origin: origin,
      },
    });
    res.status(200).json({ message: "Data Added" });
  } catch (error) {
    throw error;
  }
});

// GET THE DISTANCE BETWEEN 2 POINTS
app.get("/distance", async (req, res) => {
  const { origins, destinations } = req.query;

  if (!origins || !destinations) {
    return res.status(400).json({ error: "Missing origins or destinations" });
  }

  try {
    // Make request to Google Distance Matrix API
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origins,
          destinations: destinations,
          key: process.env.MAPS_API, // Use API_KEY from .env
        },
      }
    );

    // Extract distance from response
    console.log(response.data);
    console.log(response.data.rows.elements);
    const elements = response.data.rows[0].elements;
    if (elements.length > 0 && elements[0].status === "OK") {
      const distance = elements[0].distance.value; // Distance in meters
      res.json({
        distance,
        destination: response.data.destination_addresses[0],
        origin: response.data.origin_addresses[0],
      });
    } else {
      res.status(500).json({ error: "Failed to get distance" });
    }
  } catch (error) {
    console.error("Error fetching distance:", error);
    res.status(500).json({ error: "Error fetching distance" });
  }
});

// GET SAVED DISTANCES
app.post("/getSaved", async (req, res) => {
  const { username } = req.body;
  try {
    const details = await prisma.user.findUnique({
      where: { username: username },
      include: { locations: true },
    });
    return res.status(200).json({ details });
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
