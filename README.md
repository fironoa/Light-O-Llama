# Light-O-Llama
A minimal and efficient web-based user interface, built using pure HTML, CSS, and JavaScript. Designed to provide a lightweight, fast, and seamless experience with no external dependencies, perfect for quick interactions and local use.
<br><br>
## Using Node.js with http-server
Install http-server globally via npm:
```npm install -g http-server```
### Navigate to the folder containing your static files:
cd /path/to/your/static-files

### Run the server:
```http-server```

By default, this will serve your files at 
http://localhost:8080.


<br><br>



## Using Docker to build and run image
### Clone the repository:

```git clone https://github.com/fironoa/Light-O-Llama```<br><br>
```cd Light-O-Llama```

### Build the Docker image:

In the root directory of your project (where the Dockerfile is located), run the following command to build the Docker image:

```docker build -t light-o-llama .```
Replace your-image-name with the name you'd like for the image.

### Run the Docker container:

After the build completes, run the container using the following command:

```docker run -d -p 9500:80 light-o-llama```
This command will:

Run the container in detached mode (-d).
Map port 9500 inside the container to port 8080 on your host machine (-p 9500:80).
Access your application:

Once the container is running, you can access your app in the browser at:

http://localhost:9500

### Stop the container:

If you want to stop the container, run:

```docker stop <container_id>```
You can find the container ID by running:

```docker ps```
<br><br>
## Contributing
Contributions are welcome!
Feel free to fork the repository and submit a pull request with your changes.
<br>
### Some of the features planned.
1. Convert the MarkDown response to html
2. Session based chat history
