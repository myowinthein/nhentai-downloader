# README

### Installation

##### Create .env
```shell
cp .env.example/ .env/
```

##### Install Node Packakges
```shell
npm install -g nodemon
npm install
```

##### Enable CORS Server
- Go to [CORS Anywhere](https://cors-anywhere.herokuapp.com/corsdemo)
- Click the request button

##### Run the Project
```shell
npm run dev (with hotreloading)
```

### Usage (.env)
- `NODE_ENV=development` will download the first manga only; intended for development purpose
- `NODE_ENV=production` will download all mangas; intended for real world usage
- `MIN=2` will determine first manga number to start download
- `MAX=364152` will determine last manga number to download
> After running, downloaded mangas will be shown in `/nhentai/` directory inside the project