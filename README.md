# Mc-Clustering

This is my CS 6375 final project.

Important code locations:
 - Files in `packages/mc-datagen/src/ml` generate the data based on game files
 - Files in `packages/ml/src` do the actual machine learning with the chosen models
 - `packages/webapp` contains the website code and `scarpet` script generation

How to setup and build:
1. This is designed to work on Linux / WSL. I have not tested it on Windows
2. Install Bun, latest version of Python, and Graphviz
3. Run `bun install` in the root dir
4. Install all packages from `requirements.txt`, or make a virtual environment and activate it.
5. Run `bunx nx run webapp:build`
6. All data should be generated, the models should be trained, and the web server should start.
