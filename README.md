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
npm run start
npm run dev (with hotreloading)
```

### Change options in .env
- `NODE_ENV=development` will download only the first manga which is intended for development purposes.
- `NODE_ENV=production` will download all mangas which is intended for real-world usage.
- `MIN=2` will determine the first manga number (offset).
- `MAX=364152` will determine the total manga to download (limit).
> After running, downloaded mangas will be shown in `/nhentai/` directory inside the project
