import time
import uuid
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# custom function for get current system milliseconds
def getcurrentmills():
    # Get the current time in seconds since the epoch
    current_time_seconds = time.time()
    # Convert to milliseconds and cast to an integer
    current_time_milliseconds = int(round(current_time_seconds * 1000))
    return current_time_milliseconds


# connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Create/Get a database
db = client["cmt_db"]

# Create/Get a collection (like a table)
collection = db["todos"]


# read all & return all todos
@app.route("/todos", methods=["GET"])
def gte_todo():
    try:
        todos = list(collection.find())
        return jsonify(todos)  # todo return
    except Exception as e:
        print(e)
        jsonify({"error": "Failed to read / return todos"}), 500


# create a test item (todo) without input
@app.route("/createtestitem", methods=["POST"])
def createtestitem():
    try:
        # insert a todo to collection
        collection.insert_one(  # json code
            {
                "_id": str(uuid.uuid4()),  # id uuid4
                "title": f"test todo #{uuid.uuid1()}",  # title uuid for different
                "content": f"Test Todo Create at {getcurrentmills()}",  # current milliseconds for different todo content
                "checked": False,  # default unchecked
            }
        )
        return jsonify(
            {"message": "Test Todo Created successfully !!!"}
        )  # return a successful message
    except Exception as e:
        print(e)
        return jsonify({"Failed to create test todo ):"}), 500  # return a error message


# create a new todo with custom title & content
@app.route("/new", methods=["POST"])
def create():
    try:
        data = request.get_json()  # request a json input
        user = {  # input requested json
            "_id": str(uuid.uuid4()),  # custom ID
            "title": data.get("title"),
            "content": data.get("content"),
            "checked": False,  # default unchecked
        }
        collection.insert_one(user)  # json insert / add to database / collection
        # ✅ Return a valid JSON response
        return jsonify({"message": "Todo added successfully !!!", "todo": user}), 201
    except Exception as e:
        print(e)
        # Return a error json message
        return jsonify({"message": "Failed to add todo ):", "todo": user}), 500


# update / edit todo 
@app.route("/update", methods=["PUT"])
def update():
    data = request.get_json()  # requested data like create
    user = {  # input requested json
        "_id": data.get("id"),  # input id to edit / update
        "title": data.get("title"),
        "content": data.get("content"),
    }
    # easy to use id
    id = user["_id"]
    # print the id for debugging
    print(id)
    # query to fetch existing todo from id
    myquery = {"_id": id}
    # new value to update
    newvalues = {"$set": {"title": data.get("title"), "content": data.get("content")}}

    # find by id & update
    result = collection.update_one(myquery, newvalues)

    # if the todo not found throw this
    if result.matched_count == 0:
        return jsonify({"error": "Todo not found"}), 404

    # return a successful message
    return jsonify({"message": "Todo updated successfully!"})


# delete the todo by id
@app.route("/delete/<id>", methods=["DELETE"])
def delete(id):
    # delete the todo using id
    result = collection.delete_one({"_id": id})

    # if the todo not found throw this
    if result.deleted_count == 0:
        return jsonify({"error": "Item not found"}), 404

    # return a successful message
    return jsonify({"message": "Deleted successfully"})


# drop / delete the database completely
@app.route("/drop", methods=["DELETE"])
def drop():
    try:
        # drop the database
        collection.drop()

        # return a successful message
        return jsonify({"message": "Drop successfully"})
    except Exception as e:
        # print the error message for debugging
        print(e)

        # throw a unsuccessful message
        return jsonify({"message": "Failed To Drop"}), 500


# find & regex with title
@app.route("/findbytitle/<query>", methods=["GET"])
def findbytitle(query):
    try:
        results = collection.find(
            {"title": {"$regex": query, "$options": "i"}}  # partial & case-insensitive
        )  # find and regex
        todos = []  # todos list

        # loop for add all founded items to todos list
        for item in results:
            item["_id"] = str(item["_id"])
            todos.append(item)

        # return a successful message
        return jsonify({"results": todos})
    except Exception as e:
        # print the error message for debugging
        print(e)

        # throw a unsuccessful message
        return jsonify({"message": "Error 500"}), 500


# find & regex with content
@app.route("/findbycontent/<query>", methods=["GET"])
def findbycontent(query):
    try:
        results = collection.find(
            {
                "content": {
                    "$regex": query,
                    "$options": "i",
                }  # partial & case-insensitive
            }
        )  # find and regex

        # todos list
        todos = []

        # loop for add all founded items to todos list
        for item in results:
            item["_id"] = str(item["_id"])
            todos.append(item)

        # return a successful message
        return jsonify({"results": todos})
    except Exception as e:
        # print the error message for debugging
        print(e)

        # throw a unsuccessful message
        return jsonify({"message": "Error 500"}), 500


# query the todo from id
@app.route("/queryfromid/<id>", methods=["GET"])
def queryfromid(id):
    try:
        result = collection.find_one({"_id": id})  # find using id
        return jsonify({"todo": result})  # return a todo
    except Exception as e:
        # print the error message for debugging
        print(e)

        # throw a unsuccessful message
        return jsonify({"message": "Error 404"}), 404


# test the server and database connection
@app.route("/test", methods=["GET"])
def test():
    try:
        # Check if the database is connected
        db.command("ping")
        return (
            jsonify({"message": "Server and database connection is successful !"}),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to connect to the server or database"}), 500


# Check or toggle the 'checked' status of a todo
@app.route("/check/<id>", methods=["PATCH"])
def check(id):
    try:
        todo = collection.find_one({"_id": id})  # find todo by id
        if not todo:
            return jsonify({"error": "Todo not found"}), 404

        # toggle the 'checked' status
        new_status = not todo.get("checked", False)

        # update the todo with new status
        collection.update_one({"_id": id}, {"$set": {"checked": new_status}})

        # ✅ Return success response
        return (
            jsonify({"message": "Todo status updated", "new_status": new_status}),
            200,
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to find todo"}), 500


@app.route("/checkall", methods=["PATCH"]) 
def check_all():
    try:
        todos = list(collection.find())
        for item in todos:
            id = item.get("_id")
            my_query = {"_id": id}
            newvalues = { "$set": {"checked": True} }
            collection.update_one(my_query, newvalues)

        # ✅ Return success response
        return jsonify({"message": "All todos checked successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to check todos"}), 500
    
@app.route("/uncheckall", methods=["PATCH"])  
def uncheck_all():
    try:
        todos = list(collection.find())
        for item in todos:
            id = item.get("_id")
            my_query = {"_id": id}
            newvalues = { "$set": {"checked": False} }
            collection.update_one(my_query, newvalues)

        # ✅ Add success return
        return jsonify({"message": "All todos unchecked successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to uncheck todos"}), 500


if __name__ == "__main__":
    # Start Flask app
    app.run(debug=True, port=5000)
