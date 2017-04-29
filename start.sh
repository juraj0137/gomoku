#!/bin/bash

sudo gnome-terminal -e "sudo npm run build -- --watch"

code .

gnome-terminal -e "npm start"

gnome-terminal -e "npm run emulator"

gnome-terminal -e "npm run android"