#!/bin/bash

# GitFlow Helper Script
# Usage: ./scripts/gitflow.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Start a new feature
start_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        log_error "Feature name is required"
        echo "Usage: $0 start-feature <feature-name>"
        exit 1
    fi

    log_info "Starting new feature: $feature_name"
    
    # Switch to develop and pull latest
    git checkout develop
    git pull origin develop
    
    # Create feature branch
    git checkout -b "feature/$feature_name"
    git push -u origin "feature/$feature_name"
    
    log_success "Feature branch 'feature/$feature_name' created and pushed"
}

# Finish a feature
finish_feature() {
    local current_branch=$(get_current_branch)
    
    if [[ ! $current_branch =~ ^feature/ ]]; then
        log_error "Not on a feature branch"
        exit 1
    fi
    
    log_info "Finishing feature: $current_branch"
    
    # Push current changes
    git add .
    if ! git diff --staged --quiet; then
        read -p "Commit message: " commit_message
        git commit -m "$commit_message"
    fi
    git push origin "$current_branch"
    
    # Create pull request (requires gh CLI)
    if command -v gh &> /dev/null; then
        gh pr create --base develop --title "Feature: ${current_branch#feature/}" --body "Implement ${current_branch#feature/}"
        log_success "Pull request created"
    else
        log_warning "GitHub CLI not found. Please create pull request manually"
        echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/compare/develop...$current_branch"
    fi
}

# Start a release
start_release() {
    local version=$1
    if [ -z "$version" ]; then
        log_error "Version is required"
        echo "Usage: $0 start-release <version>"
        exit 1
    fi

    log_info "Starting release: $version"
    
    # Switch to develop and pull latest
    git checkout develop
    git pull origin develop
    
    # Create release branch
    git checkout -b "release/$version"
    
    # Update version in package.json
    if [ -f "package.json" ]; then
        npm version "$version" --no-git-tag-version
        git add package.json
        git commit -m "chore: bump version to $version"
    fi
    
    git push -u origin "release/$version"
    
    log_success "Release branch 'release/$version' created and pushed"
}

# Finish a release
finish_release() {
    local current_branch=$(get_current_branch)
    
    if [[ ! $current_branch =~ ^release/ ]]; then
        log_error "Not on a release branch"
        exit 1
    fi
    
    local version=${current_branch#release/}
    log_info "Finishing release: $version"
    
    # Push current changes
    git add .
    if ! git diff --staged --quiet; then
        git commit -m "chore: prepare release $version"
    fi
    git push origin "$current_branch"
    
    # Create pull request to main
    if command -v gh &> /dev/null; then
        gh pr create --base main --title "Release $version" --body "Release version $version to production"
        log_success "Pull request to main created"
    else
        log_warning "GitHub CLI not found. Please create pull request manually"
        echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/compare/main...$current_branch"
    fi
}

# Start a hotfix
start_hotfix() {
    local version=$1
    if [ -z "$version" ]; then
        log_error "Version is required"
        echo "Usage: $0 start-hotfix <version>"
        exit 1
    fi

    log_info "Starting hotfix: $version"
    
    # Switch to main and pull latest
    git checkout main
    git pull origin main
    
    # Create hotfix branch
    git checkout -b "hotfix/$version"
    git push -u origin "hotfix/$version"
    
    log_success "Hotfix branch 'hotfix/$version' created and pushed"
}

# Show current status
show_status() {
    local current_branch=$(get_current_branch)
    
    echo "=== GitFlow Status ==="
    echo "Current branch: $current_branch"
    echo ""
    
    # Show uncommitted changes
    if ! git diff --quiet || ! git diff --staged --quiet; then
        log_warning "You have uncommitted changes"
        git status --short
        echo ""
    fi
    
    # Show local branches
    echo "Local branches:"
    git branch
    echo ""
    
    # Show remote branches
    echo "Remote branches:"
    git branch -r | grep -E "(feature|release|hotfix)/" | head -10
    echo ""
    
    # Show recent commits
    echo "Recent commits:"
    git log --oneline -5
}

# Show help
show_help() {
    echo "GitFlow Helper Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>    Start a new feature branch"
    echo "  finish-feature          Finish current feature branch"
    echo "  start-release <version> Start a new release branch"
    echo "  finish-release          Finish current release branch"
    echo "  start-hotfix <version>  Start a new hotfix branch"
    echo "  status                  Show current GitFlow status"
    echo "  help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature user-auth"
    echo "  $0 finish-feature"
    echo "  $0 start-release 1.0.0"
    echo "  $0 status"
}

# Main script
main() {
    check_git_repo
    
    case "${1:-}" in
        "start-feature")
            start_feature "$2"
            ;;
        "finish-feature")
            finish_feature
            ;;
        "start-release")
            start_release "$2"
            ;;
        "finish-release")
            finish_release
            ;;
        "start-hotfix")
            start_hotfix "$2"
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
