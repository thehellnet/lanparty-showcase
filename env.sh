#!/bin/bash

NODE_HOME="/opt/node"

PATH="./node_modules/.bin:${NODE_HOME}/bin:${PATH}"
export PATH

PS1="NODE ${PS1}"
export PS1
