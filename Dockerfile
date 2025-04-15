# --- Stage 1: Node.js Scraper Environment ---
FROM node:18-slim AS scraper

WORKDIR /app

# Install Chromium and necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    libu2f-udev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Puppeteer config
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install Node dependencies
COPY package.json ./
RUN npm install --only=production

# Copy scraper script
COPY scrape.js ./

# --- Stage 2: Final Python + Node Runtime ---
FROM python:3.10-slim AS final

WORKDIR /app

# --- Install Node.js manually in Python slim image ---
# (Debian-based installation)
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs chromium fonts-liberation libu2f-udev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Python files
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py ./

# Copy scraper (Node) files from previous stage
COPY --from=scraper /app /app

# Expose the web port
EXPOSE 5000

# Run scraper dynamically based on SCRAPE_URL, then serve it
CMD ["sh", "-c", "node scrape.js && python server.py"]

