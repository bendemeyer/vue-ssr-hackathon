ARG NODE_VERSION='20.3.1'
ARG CYPRESS_VERSION='12.16.0'

FROM cypress/factory:2.3.0

ENV NO_COLOR=1

ENTRYPOINT ["cypress"]
