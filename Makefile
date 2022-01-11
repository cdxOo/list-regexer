MAKEFLAGS += j4

export BIN := $(shell npm bin)
.PHONY: clean test dev build install link
.DEFAULT_GOAL := build

# this will force npm install when node_modules/.bin is not present
node_modules/.bin: install

# corresponds to 'npm install' and 'npm link'
install link:
	@npm $@

clean:
	rm -rf web
	mkdir -p web

build: clean build-web

build-web: $(BIN) clean
	$(BIN)/webpack

dev: $(BIN) clean
	$(BIN)/webpack serve

define bump
	VERSION=`node -pe "require('./package.json').version"` && \
	NEXT_VERSION=`node -pe "require('semver').inc(\"$$VERSION\", '$(1)')"` && \
	node -e "\
		['./package.json'].forEach(function(fileName) {\
			var j = require(fileName);\
			j.version = \"$$NEXT_VERSION\";\
			var s = JSON.stringify(j, null, 2);\
			require('fs').writeFileSync(fileName, s);\
		});" && \
	git add package.json && \
	git commit -m "$$NEXT_VERSION" && \
	git tag "$$NEXT_VERSION"
endef

bump-patch: test
	@$(call bump,patch)

bump-minor: test
	@$(call bump,minor)

bump-major: test
	@$(call bump,major)
