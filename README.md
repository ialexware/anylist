<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Development enviroment

1. Clone the project
2. copy the `.env.template` an rename to `.env`
3. Execute

```
yarn install
```

Windows users

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

4. Execute the image (Docker desktop)

```
docker-compose up -d
```

5 Execute the nest server

```
yarn start:dev
```

6 Open the site

```
localhost:3000/graphql
```
