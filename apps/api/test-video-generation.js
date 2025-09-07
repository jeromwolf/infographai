/**
 * Test script for video generation
 */

const API_URL = 'http://localhost:4906';
let authToken = '';
let userId = '';
let projectId = '';
let scenarioId = '';

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'kelly@example.com',
      password: 'password123'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  
  const data = await response.json();
  authToken = data.token;
  userId = data.user.id;
  console.log('✅ Logged in as:', data.user.email);
  return data;
}

async function getOrCreateProject() {
  console.log('📁 Getting projects...');
  
  // Get existing projects
  const getResponse = await fetch(`${API_URL}/api/projects`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const projects = await getResponse.json();
  
  if (projects.length > 0) {
    projectId = projects[0].id;
    console.log('✅ Using existing project:', projects[0].title);
    return projects[0];
  }
  
  // Create new project if none exist
  console.log('📝 Creating new project...');
  const createResponse = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      name: 'Test Video Project',
      description: 'Testing video generation',
      topic: 'React Hooks'
    })
  });
  
  const project = await createResponse.json();
  projectId = project.id;
  console.log('✅ Created project:', project.title);
  return project;
}

async function getOrCreateScenario() {
  console.log('🎬 Getting scenarios...');
  
  // Get existing scenarios
  const getResponse = await fetch(`${API_URL}/api/scenarios?projectId=${projectId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const scenarios = await getResponse.json();
  
  if (scenarios.length > 0) {
    scenarioId = scenarios[0].id;
    console.log('✅ Using existing scenario:', scenarios[0].title);
    return scenarios[0];
  }
  
  // Create new scenario if none exist
  console.log('📝 Creating new scenario...');
  const createResponse = await fetch(`${API_URL}/api/scenarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      projectId: projectId,
      title: 'Test Scenario',
      description: 'Testing video generation scenario',
      duration: 30,
      scenes: [
        {
          type: 'title',
          duration: 3,
          title: 'React Hooks Tutorial',
          subtitle: 'Learn the basics',
          narration: 'Welcome to our React Hooks tutorial'
        },
        {
          type: 'content',
          duration: 5,
          title: 'What are Hooks?',
          narration: 'React Hooks allow you to use state and other React features without writing a class component'
        },
        {
          type: 'content',
          duration: 5,
          title: 'useState Hook',
          narration: 'The useState hook lets you add state to functional components'
        },
        {
          type: 'conclusion',
          duration: 3,
          title: 'Thank You!',
          narration: 'Thanks for watching this tutorial on React Hooks'
        }
      ]
    })
  });
  
  const scenario = await createResponse.json();
  scenarioId = scenario.id;
  console.log('✅ Created scenario:', scenario.title);
  return scenario;
}

async function generateVideo() {
  console.log('🎥 Generating video...');
  
  const response = await fetch(`${API_URL}/api/videos/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      projectId: projectId,
      scenarioId: scenarioId
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Video generation failed: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  console.log('✅ Video generation started:', result.video.id);
  return result.video;
}

async function checkVideoStatus(videoId) {
  console.log('📊 Checking video status...');
  
  const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get video status: ${response.status}`);
  }
  
  const video = await response.json();
  console.log(`Status: ${video.status}, Progress: ${video.progress}%`);
  
  if (video.url) {
    console.log(`🎬 Video URL: ${API_URL}${video.url}`);
  }
  
  return video;
}

async function waitForVideo(videoId, maxAttempts = 30) {
  console.log('⏳ Waiting for video to complete...');
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const video = await checkVideoStatus(videoId);
    
    if (video.status === 'COMPLETED') {
      console.log('🎉 Video generation completed!');
      console.log(`📺 View video at: ${API_URL}${video.url}`);
      console.log(`📄 View preview at: ${API_URL}/videos/${videoId}.html`);
      return video;
    }
    
    if (video.status === 'FAILED') {
      throw new Error(`Video generation failed: ${video.error}`);
    }
  }
  
  throw new Error('Video generation timed out');
}

async function main() {
  try {
    console.log('🚀 Starting video generation test...\n');
    
    await login();
    await getOrCreateProject();
    await getOrCreateScenario();
    
    const video = await generateVideo();
    await waitForVideo(video.id);
    
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();