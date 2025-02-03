# Light-O-Llama
A minimal and efficient web-based user interface, built using pure HTML, CSS, and JavaScript. Designed to provide a lightweight, fast, and seamless experience with no external dependencies, perfect for quick interactions and local use.


## Steps to Build and Run the Docker Image
### Clone the repository:

```git clone https://github.com/your-username/your-repository.git```
```cd your-repository```

### Build the Docker image:

In the root directory of your project (where the Dockerfile is located), run the following command to build the Docker image:

```docker build -t image-name .```
Replace your-image-name with the name you'd like for the image.

### Run the Docker container:

After the build completes, run the container using the following command:

```docker run -d -p 9500:80 image-name```
This command will:

Run the container in detached mode (-d).
Map port 9500 inside the container to port 8080 on your host machine (-p 9500:80).
Access your application:

Once the container is running, you can access your app in the browser at:

http://localhost:8080

### Stop the container:

If you want to stop the container, run:

```docker stop <container_id>```
You can find the container ID by running:

```docker ps```
