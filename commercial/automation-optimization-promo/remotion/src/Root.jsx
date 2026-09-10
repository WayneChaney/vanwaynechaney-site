import {Composition} from 'remotion';
import {AutomationOptimizationPromo} from './AutomationOptimizationPromo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="AutomationOptimizationPromo"
      component={AutomationOptimizationPromo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{assetsReady: false}}
    />
  );
};