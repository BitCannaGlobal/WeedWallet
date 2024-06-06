ARG BASE_IMAGE=node:18-alpine3.18

# This is a multiple stage Dockerfile.

# - Stage 1: builder (adds dependencies, environment variables, and builds the project using yarn)

# - Stage 2: runner (final image for the web project, sets environment variables, starts the server)

################################################################################

# Stage: builder
FROM  ${BASE_IMAGE} AS builder


### First install the dependencies (as they change less often)
COPY . /app

WORKDIR /app
## Setting up the environment variables for the docker container.

RUN yarn install 
#--inline-builds

## Build the project
RUN yarn build

################################################################################

# Stage: runner
FROM builder AS  runner

WORKDIR /app

CMD yarn preview --host 0.0.0.0 --port 4200