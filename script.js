const environmentVideo = document.getElementById('environment-video');
if (environmentVideo) {
  const environments = {
    doorkey: {
      title: 'DoorKey', source: 'assets/doorkey-20s.mp4', poster: 'assets/doorkey-poster.jpg',
      caption: 'Find a key, unlock a door, and reach the goal.',
      docs: 'https://minigrid.farama.org/main/environments/minigrid/DoorKeyEnv/',
      summary: 'DoorKey: AIC has higher mean reward (+0.0211) and uses 3.36 refinements on average versus 8 for Fixed-8.'
    },
    memory: {
      title: 'Memory', source: 'assets/memory-20s.mp4', poster: 'assets/memory-poster.jpg',
      caption: 'Observe a cue, cross a hallway, and choose the matching object.',
      docs: 'https://minigrid.farama.org/v2.4.0/environments/minigrid/MemoryEnv/',
      summary: 'Memory: AIC has higher mean reward (+0.0211) and uses 3.31 refinements on average versus 8 for Fixed-8.'
    },
    stackcube: {
      title: 'StackCube', source: 'assets/stackcube-20s.mp4', poster: 'assets/stackcube-poster.jpg',
      caption: 'A robot arm grasps the red cube and stacks it on the green cube.',
      docs: 'https://maniskill.readthedocs.io/en/latest/tasks/table_top_gripper/index.html#stackcube-v1',
      summary: 'StackCube: AIC has higher reported mean reward (+0.0121) at the B = 8 operating point.',
      label: 'Twenty-second slowed ManiSkill StackCube sample demonstration; not a fixed-policy or AIC rollout.'
    }
  };
  let selected = 'doorkey';
  const envButtons = [...document.querySelectorAll('[data-env]')];
  const chartButtons = [...document.querySelectorAll('[data-chart-env]')];
  const toggle = document.getElementById('video-toggle');
  const status = document.getElementById('video-status');
  const caption = document.getElementById('environment-caption');
  const docs = document.getElementById('environment-docs');
  const license = document.getElementById('environment-license');
  const phase = document.getElementById('video-phase');
  const summary = document.getElementById('graph-summary');
  const format = seconds => `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
  function refresh() {
    const info = environments[selected];
    toggle.textContent = environmentVideo.paused ? '▶ Play' : '❚❚ Pause';
    toggle.setAttribute('aria-label', environmentVideo.paused ? `Play ${info.title} video` : `Pause ${info.title} video`);
    status.textContent = `${info.title} · ${format(environmentVideo.currentTime)} / 0:20`;
    if (phase) {
      phase.hidden = selected !== 'stackcube';
      if (selected === 'stackcube') {
        const t = environmentVideo.currentTime;
        phase.textContent = t < 5 ? '01 / Reach' : t < 11 ? '02 / Grasp' : t < 16 ? '03 / Lift' : '04 / Stack';
      }
    }
  }
  function selectEnvironment(id, play = true) {
    const info = environments[id];
    if (!info) return;
    selected = id;
    environmentVideo.poster = info.poster;
    environmentVideo.setAttribute('aria-label', info.label || `Twenty-second scripted MiniGrid ${info.title} run.`);
    environmentVideo.src = info.source;
    environmentVideo.load();
    caption.textContent = info.caption;
    docs.href = info.docs;
    license.href = id === 'stackcube' ? 'assets/ManiSkill-LICENSE.txt' : 'assets/MiniGrid-LICENSE.txt';
    summary.textContent = info.summary;
    envButtons.forEach(button => {
      const active = button.dataset.env === id;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    chartButtons.forEach(button => {
      const active = button.dataset.chartEnv === id;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (play) environmentVideo.play().catch(() => {});
    refresh();
  }
  envButtons.forEach(button => button.addEventListener('click', () => selectEnvironment(button.dataset.env)));
  chartButtons.forEach(button => button.addEventListener('click', () => selectEnvironment(button.dataset.chartEnv)));
  toggle.addEventListener('click', () => {
    if (environmentVideo.paused) environmentVideo.play().catch(() => {});
    else environmentVideo.pause();
    refresh();
  });
  for (const event of ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended']) {
    environmentVideo.addEventListener(event, refresh);
  }
  refresh();
}
