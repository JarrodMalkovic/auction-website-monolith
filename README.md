# Auction Site

## Usage

### Add a config.env file to the root directory with the following

```bash
PORT=5000
MONGO_URI=<your_mongoDB_Atlas_uri_with_credentials>
JWT_SECRET=<your_secret_jwt_token>
CLOUD_NAME=<your_cloudinary_cloud_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

## Testing

```bash
npm run test
```

## Features

Full API Documentation:
