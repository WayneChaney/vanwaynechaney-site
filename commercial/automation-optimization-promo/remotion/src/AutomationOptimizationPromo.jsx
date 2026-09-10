import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  ink: '#111820',
  paper: '#f6f2ea',
  orange: '#ff5a1f',
  cyan: '#3ab8ca',
  muted: '#77838c',
  line: '#c9c4ba',
};

const enter = (frame, delay = 0, distance = 42) => ({
  opacity: interpolate(frame, [delay, delay + 12], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
  transform: `translateY(${interpolate(frame, [delay, delay + 14], [distance, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })}px)`,
});

const Kicker = ({children, color = COLORS.orange}) => (
  <div style={{color, fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: 3}}>{children}</div>
);

const Rule = ({delay = 0, color = COLORS.orange, width = 360}) => {
  const frame = useCurrentFrame();
  return <div style={{backgroundColor: color, height: 6, marginTop: 26, transform: `scaleX(${interpolate(frame, [delay, delay + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`, transformOrigin: 'left'}} />;
};

const FacePanel = ({assetsReady, file, label, position = 'right'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = Math.min(spring({frame: Math.max(frame - 10, 0), fps, config: {damping: 16, stiffness: 110}}), 1);
  const side = position === 'right' ? {right: 88} : {left: 88};
  return (
    <div style={{position: 'absolute', top: 122, ...side, width: 560, height: 730, backgroundColor: COLORS.ink, border: `10px solid ${COLORS.paper}`, boxShadow: '22px 22px 0 #ff5a1f', overflow: 'hidden', transform: `scale(${scale})`, transformOrigin: position === 'right' ? 'right center' : 'left center'}}>
      {assetsReady ? <Video src={staticFile(`media/${file}`)} style={{height: '100%', objectFit: 'cover', width: '100%'}} /> : (
        <AbsoluteFill style={{backgroundColor: COLORS.ink, justifyContent: 'flex-end', padding: 40}}>
          <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(135deg, transparent 49.5%, #ff5a1f 50%, transparent 50.5%)', opacity: 0.55}} />
          <div style={{color: COLORS.paper, fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: 2, zIndex: 1}}>WAYNE ON CAMERA</div>
          <div style={{color: COLORS.orange, fontFamily: 'Arial, sans-serif', fontSize: 52, fontWeight: 900, lineHeight: 0.95, marginTop: 12, zIndex: 1}}>{label}</div>
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', left: 26, top: 26, backgroundColor: COLORS.orange, color: COLORS.ink, fontFamily: 'Arial, sans-serif', fontSize: 18, fontWeight: 900, letterSpacing: 1.5, padding: '12px 16px'}}>{label.toUpperCase()}</div>
    </div>
  );
};

const FlowNode = ({title, detail, index, active = false}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(spring({frame: Math.max(frame - index * 10, 0), fps: 30, config: {damping: 16, stiffness: 120}}), 1);
  return (
    <div style={{backgroundColor: active ? COLORS.orange : COLORS.paper, border: `3px solid ${COLORS.ink}`, boxSizing: 'border-box', minHeight: 178, padding: 24, position: 'relative', zIndex: 2, transform: `translateY(${(1 - progress) * 52}px)`, opacity: progress}}>
      <div style={{color: active ? COLORS.ink : COLORS.orange, fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: 2}}>0{index + 1}</div>
      <div style={{color: COLORS.ink, fontFamily: 'Arial, sans-serif', fontSize: 34, fontWeight: 900, lineHeight: 1, marginTop: 26}}>{title}</div>
      <div style={{color: '#47535b', fontFamily: 'Arial, sans-serif', fontSize: 21, lineHeight: 1.2, marginTop: 11}}>{detail}</div>
    </div>
  );
};

const Pipeline = ({nodes, active}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${nodes.length}, 1fr)`, gap: 18, marginTop: 58, position: 'relative'}}>
      <div style={{backgroundColor: COLORS.ink, height: 7, left: 40, right: 40, position: 'absolute', top: 85, zIndex: 0}} />
      <div style={{backgroundColor: COLORS.orange, height: 7, left: 40, width: `${Math.min(100, 18 + frame * 1.2)}%`, position: 'absolute', top: 85, zIndex: 1}} />
      {nodes.map((node, index) => <FlowNode key={node.title} {...node} index={index} active={active === index} />)}
    </div>
  );
};

const ServiceScene = ({assetsReady, file, index, kicker, title, copy, nodes}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper, color: COLORS.ink, padding: '96px 760px 90px 100px'}}>
      <div style={enter(frame, 0)}><Kicker>{`0${index} / ${kicker}`}</Kicker></div>
      <div style={{...enter(frame, 8), fontFamily: 'Arial, sans-serif', fontSize: 98, fontWeight: 900, lineHeight: 0.9, marginTop: 22}}>{title}</div>
      <Rule delay={13} width={330} />
      <div style={{...enter(frame, 22), color: '#45535d', fontFamily: 'Arial, sans-serif', fontSize: 32, lineHeight: 1.25, marginTop: 34, maxWidth: 880}}>{copy}</div>
      <Pipeline nodes={nodes} active={Math.floor(frame / 32) % nodes.length} />
      <div style={{...enter(frame, 52), color: COLORS.ink, fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 800, marginTop: 38}}>THE WORK SHOULD KEEP MOVING WHEN YOU ARE BUSY.</div>
      <FacePanel assetsReady={assetsReady} file={file} label={kicker} />
    </AbsoluteFill>
  );
};

const Opening = () => {
  const frame = useCurrentFrame();
  const counter = Math.floor(interpolate(frame, [10, 120], [0, 6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, color: COLORS.paper, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.28, backgroundImage: 'linear-gradient(#2e3c43 1px, transparent 1px), linear-gradient(90deg, #2e3c43 1px, transparent 1px)', backgroundSize: '80px 80px'}} />
      <div style={{position: 'absolute', right: -100, top: -190, width: 750, height: 750, border: `90px solid ${COLORS.orange}`, borderRadius: '50%', opacity: 0.95}} />
      <div style={{padding: '118px 120px', position: 'relative', maxWidth: 1450}}>
        <div style={enter(frame, 0)}><Kicker color={COLORS.orange}>BUSINESS OPTIMIZATION</Kicker></div>
        <div style={{...enter(frame, 10), fontFamily: 'Arial, sans-serif', fontSize: 126, fontWeight: 900, lineHeight: 0.88, marginTop: 34}}>REVENUE LEAKS<br />IN THE GAPS.</div>
        <div style={{...enter(frame, 32), fontFamily: 'Arial, sans-serif', fontSize: 38, lineHeight: 1.25, marginTop: 54, maxWidth: 890, color: '#c6d0d0'}}>A lead waits. A handoff breaks. A task disappears. Small delays cost real money.</div>
        <div style={{...enter(frame, 48), backgroundColor: COLORS.paper, color: COLORS.ink, display: 'inline-flex', alignItems: 'center', gap: 20, marginTop: 72, padding: '22px 28px', fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900}}><span style={{color: COLORS.orange}}>MISSED MOVES</span><span>{counter.toString().padStart(2, '0')}</span></div>
      </div>
    </AbsoluteFill>
  );
};

const Closing = ({assetsReady}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.orange, color: COLORS.ink, padding: '105px 120px'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '43%', backgroundColor: COLORS.ink}} />
      <div style={{position: 'absolute', left: 100, top: 122, width: 560, height: 730}}>
        {assetsReady ? <Video src={staticFile('media/wayne-close.mp4')} style={{height: '100%', objectFit: 'cover', width: '100%'}} /> : <FacePanel assetsReady={false} file="wayne-close.mp4" label="Vanwayne" position="left" />}
      </div>
      <div style={{position: 'absolute', left: '52%', right: 100, top: 118}}>
        <div style={enter(frame, 0)}><Kicker color={COLORS.ink}>VANWAYNE CHANEY JR.</Kicker></div>
        <div style={{...enter(frame, 8), fontFamily: 'Arial, sans-serif', fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginTop: 30}}>FIND THE<br />BOTTLENECK.<br />MOVE FASTER.</div>
        <div style={{...enter(frame, 26), fontFamily: 'Arial, sans-serif', fontSize: 32, fontWeight: 700, marginTop: 48, lineHeight: 1.25}}>Computer Engineer<br />Miami University</div>
        <div style={{...enter(frame, 42), borderTop: '5px solid #111820', paddingTop: 26, fontFamily: 'Arial, sans-serif', fontSize: 30, fontWeight: 900, marginTop: 58}}>VANWAYNECHANEY.COM</div>
      </div>
    </AbsoluteFill>
  );
};

export const AutomationOptimizationPromo = ({assetsReady}) => (
  <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
    {assetsReady ? <Audio src={staticFile('media/music.mp3')} volume={0.16} /> : null}
    <Sequence from={0} durationInFrames={180}><Opening /></Sequence>
    <Sequence from={180} durationInFrames={210}><ServiceScene assetsReady={assetsReady} file="wayne-leadgen.mp4" index={1} kicker="Lead Generation" title={<>CAPTURE.<br />QUALIFY.<br />BOOK.</>} copy="When someone raises their hand, the system captures the lead and puts the next move in front of your team." nodes={[{title: 'Capture', detail: 'Every inquiry lands.'}, {title: 'Qualify', detail: 'The right detail, first.'}, {title: 'Book', detail: 'A real next step.'}]} /></Sequence>
    <Sequence from={390} durationInFrames={210}><ServiceScene assetsReady={assetsReady} file="wayne-followup.mp4" index={2} kicker="Follow-Up" title={<>FOLLOW UP<br />BEFORE<br />THEY COOL.</>} copy="The system keeps the conversation moving so your team is not chasing texts or guessing who owns the next response." nodes={[{title: 'Trigger', detail: 'A clear moment to act.'}, {title: 'Route', detail: 'The right owner, fast.'}, {title: 'Respond', detail: 'Before attention fades.'}]} /></Sequence>
    <Sequence from={600} durationInFrames={180}><ServiceScene assetsReady={assetsReady} file="wayne-operations.mp4" index={3} kicker="Operations" title={<>LESS MANUAL.<br />MORE CLEAR.</>} copy="Cleaner handoffs and visible work give people time back and leaders a real view of what is happening." nodes={[{title: 'Intake', detail: 'Details stay organized.'}, {title: 'Handoff', detail: 'Ownership stays clear.'}, {title: 'Visible', detail: 'Work is easy to see.'}]} /></Sequence>
    <Sequence from={780} durationInFrames={120}><Closing assetsReady={assetsReady} /></Sequence>
  </AbsoluteFill>
);