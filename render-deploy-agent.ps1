<#
Render Deploy Agent for Infoblox Value Model

This script helps you prepare the repo, commit changes, push to GitHub,
and then open Render so you can connect your static site.

Run this from the repo folder and follow the prompts.
#>

param(
    [string]$RepoPath = ".",
    [string]$RemoteName = "origin",
    [switch]$AutoConfirm
)

Set-StrictMode -Version Latest

function Prompt-YesNo($message) {
    if ($AutoConfirm) { return $true }
    do {
        $answer = Read-Host "$message [Y/N]"
    } while ($answer -notmatch '^[yYnN]$')
    return $answer -match '^[yY]$'
}

function Get-GitCommand {
    $paths = @(
        'git',
        'C:\\Program Files\\Git\\cmd\\git.exe',
        'C:\\Program Files\\Git\\bin\\git.exe',
        'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
        'C:\\Program Files (x86)\\Git\\bin\\git.exe'
    )

    foreach ($path in $paths) {
        try {
            $output = & $path --version 2>$null
            if ($output) { return $path }
        } catch {
            continue
        }
    }
    return $null
}

function Ensure-Path($path) {
    try {
        return Resolve-Path -Path $path
    } catch {
        Write-Error "Path '$path' does not exist."
        exit 1
    }
}

$fullPath = Ensure-Path $RepoPath
Set-Location $fullPath
Write-Host "\n=== Render Deploy Agent ===" -ForegroundColor Cyan
Write-Host "Repo path: $fullPath\n"

if (-not (Test-Path -Path .\index.html)) {
    Write-Error "index.html was not found in this directory. Make sure you run this script from the app root."
    exit 1
}

$GitCommand = Get-GitCommand
if (-not $GitCommand) {
    Write-Error "Git does not appear to be installed or available in PATH. Install Git before continuing."
    exit 1
}

$gitRoot = & $GitCommand rev-parse --show-toplevel 2>$null
if (-not $gitRoot) {
    Write-Host "This folder is not currently a Git repository."
    if (Prompt-YesNo "Initialize a new Git repository here?") {
        & $GitCommand init
        Write-Host "Git repository initialized."
    } else {
        Write-Error "Cannot continue without a Git repository."
        exit 1
    }
} else {
    Write-Host "Git repository detected at: $gitRoot"
}

Write-Host "\nChecking working tree status..."
$gitStatus = & $GitCommand status --porcelain
if ($gitStatus) {
    Write-Host "Uncommitted changes found:" -ForegroundColor Yellow
    Write-Host $gitStatus
    if (Prompt-YesNo "Stage all changes and commit them now?") {
        & $GitCommand add .
        $commitMessage = Read-Host "Enter commit message (default: Deploy app changes to Render)"
        if (-not $commitMessage) { $commitMessage = 'Deploy app changes to Render' }
        & $GitCommand commit -m "$commitMessage"
        Write-Host "Changes committed."
    } else {
        Write-Error "Please commit your changes before pushing to GitHub."
        exit 1
    }
} else {
    Write-Host "Working tree is clean."
}

$remoteUrl = & $GitCommand remote get-url $RemoteName 2>$null
if (-not $remoteUrl) {
    Write-Host "No remote named '$RemoteName' is configured."
    if (Prompt-YesNo "Add a GitHub remote now?") {
        $remoteUrl = Read-Host "Enter GitHub remote URL (e.g. https://github.com/username/Infoblox-Value-Model.git)"
        & $GitCommand remote add $RemoteName $remoteUrl
        Write-Host "Remote '$RemoteName' added."
    } else {
        Write-Error "A remote is required for Render deployment."
        exit 1
    }
} else {
    Write-Host "Remote '$RemoteName' points to: $remoteUrl"
}

$branchName = & $GitCommand branch --show-current
if (-not $branchName) {
    $branchName = 'main'
    Write-Host "Unable to detect current branch. Defaulting to 'main'."
}
Write-Host "Current branch: $branchName"

if (Prompt-YesNo "Push '$branchName' to '$RemoteName' now?") {
    & $GitCommand push -u $RemoteName $branchName
    Write-Host "Branch pushed to GitHub."
} else {
    Write-Host "Skipping push. You can push manually later."
}

Write-Host "\n=== Ready for Render ===" -ForegroundColor Green
Write-Host "Use these Render settings:"
Write-Host "  Source: GitHub repo connected to $remoteUrl"
Write-Host "  Name: Infoblox-Value-Model"
Write-Host "  Branch: $branchName"
Write-Host "  Root Directory: /"
Write-Host "  Build Command: (leave blank)"
Write-Host "  Publish Directory: /"
Write-Host "\nWhen Render deploys, confirm that the site is using the repo root and index.html is present."

if (Prompt-YesNo "Open Render new static site page in your browser now?") {
    Start-Process "https://render.com/dashboard/new/static"
}

Write-Host "\nDone. Review Render settings and deploy from the Render dashboard." -ForegroundColor Cyan
