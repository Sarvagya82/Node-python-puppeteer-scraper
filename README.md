# 🧪 Multi-Stage Scraper with Node.js + Puppeteer + Flask (Dockerized)

This project demonstrates how to use a **multi-stage Docker build** that combines:
- Node.js & Puppeteer to **scrape data** from a provided URL using a headless browser.
- Python (Flask) to **serve the scraped data** over HTTP.

---

## 🚀 Features

- 📦 Multi-stage Docker build (Node.js + Python)
- 🌐 Scrapes any URL using Puppeteer
- 📄 Extracts page `<title>` and first `<h1>` element
- 📡 Serves scraped data as JSON via a Flask server
- ⚙️ URL is dynamically passed using an environment variable

---

## 📁 Project Structure

├── Dockerfile ├── package.json ├── requirements.txt ├── scrape.js # Puppeteer scraper (Node.js) ├── server.py # Flask API server (Python)

🧪 Run the Container
Pass the target URL using the SCRAPE_URL environment variable:
docker run -p 5001:5000 --env SCRAPE_URL="https://getbootstrap.com" --name my-scraper multi-stage-scraper

🌐 Access the Output
Once the container is running, open your browser:http://localhost:5001/

You will see a JSON output like:
{
  "title": "Example Domain",
  "firstHeading": "Example Domain"
}

Like Example : https://www.python.org , https://getbootstrap.com

🙌 Author
Sarvagya Mishra

