FROM ghcr.io/anomalyco/opencode:2.4.1

# The upstream image is a slim Alpine base that ships neither git nor a POSIX
# shell beyond busybox. OpenCode shells out to git for repositories, diffs and
# worktrees, and uses a shell for its terminal tool, so both are required for
# the service to work as documented. openssh-client lets git reach ssh remotes.
RUN apk add --no-cache git bash openssh-client
