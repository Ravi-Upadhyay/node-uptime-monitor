# Node Uptime Monitor

In this we are building a RESTful API for an uptime monitoring application. We will not be using any Node.js library. We will be using built-in Node.js modules.

An uptime monitor app lets user enter URL they want to be monitored and receieve updates when it goes up or down.

---

## Index

- [Requirements](#requirements)
- [Project structure](#structure)
- [To do](#todo)

---

## Requirements<a name="requirements"></a>

1. API that listens on `PORT` and accepts incoming `HTTP` requests - `POST`, `GET`, `PUT`, `DELETE` and `HEAD`.
2. API allows a client to connect and then create a user then edit or delete that user.
3. API allows user to `signin` using token authentication. This token can be used for subsequent requests.
4. API allows user to `signout` which invalidates the token.
5. API allows signed in user to create a `check`. `check` means a task to check a particular url.
6. API allows user to edit or delete their checks and we want to limit the checks to the five.
7. Worker in the background to perform all the checks and alert the user.

---

## Project structure<a name="structure"></a>

```
- node-uptime-monitor
    - .data                     // DIR: Hidden directory to store data using file system
    - https                     // DIR: Directory to store ssl certificate and key for https
        - cert.pem
        - key.pem
    - lib                       // DIR: Libraries created
        - data-handler-lib.js   // FILE: Library for CRUD operations
    - config.js                 // FILE: Configuration related to project, Environment ..
    - index.js                  // FILE: Main File, Entry point for the SERVER
```

---

## To do<a name="todo"></a>

[] Refactor the code, specially in index.js. Further normalization can be done


---

