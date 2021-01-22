#!/bin/sh
while read oldrev newrev refname
do
	GIT_BRANCH="$(git rev-parse --symbolic --abbrev-ref $refname)"
	TARGET_DIR="/var/www/html/$GIT_BRANCH"

	echo "██████╗  ██████╗ ███████╗    ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗"
	echo "██╔══██╗██╔═══██╗██╔════╝    ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗"
	echo "██████╔╝██║   ██║███████╗    ██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝"
	echo "██╔══██╗██║   ██║╚════██║    ██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗"
	echo "██║  ██║╚██████╔╝███████║    ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║"
	echo "╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝"

	echo "ROS Dashboard builder"
	echo "Rev: $refname"
	echo "Branch: $GIT_BRANCH"
	echo "Target directory: $TARGET_DIR"
	
	mkdir -p "$TARGET_DIR"
	
	docker run --rm \
		-v "$(pwd):/source:ro" \
	        -v "$TARGET_DIR:/target:rw" \
	        -e REV="$1" \
	        dashboard-builder
done
