PROJECT = "The Not So Fancy Photo Gallery"
BIN = ./node_modules/.bin

update:
	@echo "Updating $(PROJECT)...\n"
	npm update
	@echo "All dependencies updated! To get started run: make run \n"

test:
	@echo "Buckle up! We are about to run some tests...\n"
	@$(BIN)/mocha --recursive --reporter spec

run:
	@echo "Running $(PROJECT)...\n"
	node app.js

.PHONY: update test run
