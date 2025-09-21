# Terminal Simulator Templates

## Available Templates

- **docker-terminal.svg**: Docker Commands Terminal
- **git-workflow.svg**: Git Workflow Terminal
- **linux-system.svg**: Linux System Management
- **nodejs-dev.svg**: Node.js Development Terminal

## Features

### Core Terminal Elements
- **Terminal Headers**: Realistic window controls (close, minimize, maximize)
- **Command Prompts**: Environment-specific prompts with proper styling
- **Syntax Highlighting**: Command and output color coding
- **Progress Bars**: Visual progress indicators for long operations
- **Status Indicators**: Real-time system status and health monitoring

### Animations
- **Typing Effect**: Simulates real command typing
- **Command Execution**: Shows command processing states
- **Progress Animation**: Dynamic progress bars and loading states
- **Output Streaming**: Realistic output appearance timing
- **System Monitoring**: Live system metrics updates

### Terminal Types

#### Docker Terminal
- Container lifecycle commands
- Image building progress
- Port mapping visualization
- Docker Compose operations

#### Git Workflow Terminal  
- Version control commands
- Branch visualization
- Commit history display
- Push/pull status updates

#### Linux System Terminal
- File system operations
- Process monitoring
- System resource usage
- Service status checks

#### Node.js Development Terminal
- Package management (npm/yarn)
- Development server startup
- Build process monitoring
- Dependency installation

## Educational Use Cases

### For DevOps Topics
```javascript
{
  template: 'docker-terminal',
  scenario: 'container-deployment',
  commands: [
    'docker build -t myapp .',
    'docker run -d -p 3000:3000 myapp',
    'docker ps'
  ],
  duration: 10000
}
```

### For Git Training
```javascript
{
  template: 'git-workflow',
  scenario: 'feature-branch-workflow',
  commands: [
    'git checkout -b feature/new-component',
    'git add .',
    'git commit -m "Add new component"',
    'git push origin feature/new-component'
  ],
  duration: 12000
}
```

### For System Administration
```javascript
{
  template: 'linux-system',
  scenario: 'server-monitoring',
  commands: [
    'top',
    'df -h', 
    'systemctl status nginx',
    'tail -f /var/log/nginx/access.log'
  ],
  duration: 15000
}
```

### For Frontend Development
```javascript
{
  template: 'nodejs-dev',
  scenario: 'project-setup',
  commands: [
    'npm init -y',
    'npm install react react-dom',
    'npm run build',
    'npm start'
  ],
  duration: 8000
}
```

## Customization Options

### Color Schemes
- **Dark themes**: Professional development environment feel
- **Retro terminals**: Classic green-on-black styling
- **Modern themes**: Contemporary color schemes
- **High contrast**: Accessibility-focused designs

### Command Simulation
- **Realistic timing**: Commands execute at natural speeds
- **Error handling**: Show command failures and fixes
- **Interactive elements**: Simulate user input and responses
- **Multi-step processes**: Complex workflows with dependencies

## Performance Optimizations

- Lightweight SVG animations
- Efficient CSS transitions
- Minimal DOM manipulation
- Smooth 60fps animations
- Fast loading times

## Integration with InfoGraphAI

These terminals integrate seamlessly with:
- Architecture diagrams
- Code editors
- Process flows
- Data visualizations

Perfect for creating comprehensive technical tutorials that show both theory and practice.
