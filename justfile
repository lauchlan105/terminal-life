build:
  #!/bin/bash
  set -e
  yarn run ts-node ./build.ts

dev:
  #!/bin/bash
  set -e
  yarn run nodemon --exec "yarn run ts-node build.ts && yarn serve" --ext ts
