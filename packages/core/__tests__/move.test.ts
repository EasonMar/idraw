import { requestAnimationFrameMock } from '../../../__tests__/polyfill/requestanimateframe';
import '../../../__tests__/polyfill/image';

import IDraw from '../src';
import { getData } from './data';

// function delay(time: number): Promise<void> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, time)
//   });
// }

describe("@idraw/core", () => {

  beforeEach(() => {
    requestAnimationFrameMock.reset();
  })

  test('moveDownElement', async () => {  
    document.body.innerHTML = `
      <div id="mount"></div>
    `;
    const opts = {
      width: 600,
      height: 400,
      contextWidth: 600,
      contextHeight: 400,
      devicePixelRatio: 4
    }
    const mount = document.querySelector('#mount') as HTMLDivElement;
    const idraw = new IDraw(mount, opts);
    const data = getData();
    idraw.setData(data);
    idraw.moveUpElement('image-003'); 

    requestAnimationFrameMock.triggerNextAnimationFrame();
  
    const originCtx = idraw.__getOriginContext2D();
    // @ts-ignore;
    const originCalls = originCtx.__getDrawCalls();
    expect(originCalls).toMatchSnapshot();
  
    const displayCtx = idraw.__getDisplayContext2D();
    // @ts-ignore;
    const displayCalls = displayCtx.__getDrawCalls();
    expect(displayCalls).toMatchSnapshot();
  });

  test('moveUpElement', async () => {  
    document.body.innerHTML = `
      <div id="mount"></div>
    `;
    const opts = {
      width: 600,
      height: 400,
      contextWidth: 600,
      contextHeight: 400,
      devicePixelRatio: 4
    }
    const mount = document.querySelector('#mount') as HTMLDivElement;
    const idraw = new IDraw(mount, opts);
    const data = getData();
    idraw.setData(data);
    idraw.moveDownElement('image-003'); 

    requestAnimationFrameMock.triggerNextAnimationFrame();
  
    const originCtx = idraw.__getOriginContext2D();
    // @ts-ignore;
    const originCalls = originCtx.__getDrawCalls();
    expect(originCalls).toMatchSnapshot();
  
    const displayCtx = idraw.__getDisplayContext2D();
    // @ts-ignore;
    const displayCalls = displayCtx.__getDrawCalls();
    expect(displayCalls).toMatchSnapshot();
  });
  
});




