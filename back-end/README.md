# Curl Commands
#### All Curl Commands to use the database with shell

### Read / Get the all todos
```shell
curl -X GET http://localhost:5000/todos
```

### Test the server and database
```shell
curl -X GET http://localhost:5000/test
```

### Create New Todo
```shell
curl -X POST http://localhost:5000/new \
  -H "Content-Type: application/json" \
  -d '{"title":"  < Todo Title >  ","content":"  < Todo Content > "}'
```

### Create a test item
```shell
curl -X POST http://localhost:5000/createtestitem
```

### Update / Edit the todo
```shell
curl -X PUT http://localhost:5000/update \
  -H "Content-Type: application/json" \
  -d '{"id": "<id>", "title":"  < New Todo Title >  ","content":"  < New Todo Content > "}'
```

### check the todo
```shell
curl -X PATCH http://localhost:5000/check/<id>
```

### Delete a todo
```shell
curl -X DELETE http://localhost:5000/delete/<id>
```

### Drop / Delete the database or collection
```shell
curl -X DELETE http://localhost:5000/drop
```

### Find the todo by title
```shell
# You no need to write the full title / start with letters. You can use any character of todo's title
curl -X GET http://localhost:5000/findbytitle/<title>
```

### Get todo status
```shell
curl -X GET http://localhost:5000/status/<id>
```

### Find the todo by content
```shell
# You no need to write the full content / start with letters. You can use any character of todo's content
curl -X GET http://localhost:5000/findbycontent/<content>
```

### Query the todo with id
```shell
# You need to use full id not like Find with title / content
curl -X GET http://localhost:5000/queryfromid/<id>
```
---