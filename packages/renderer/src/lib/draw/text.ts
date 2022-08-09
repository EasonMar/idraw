import {
  TypeContext,
  TypeElemDescText,
  TypeElement,
} from '@idraw/types';
import util from '@idraw/util';
import Loader from '../loader';
import { clearContext, drawBox } from './base';
import { rotateElement } from './../transform';

const { is, color } = util;

export function drawText(
  ctx: TypeContext,
  elem: TypeElement<'text'>,
  loader: Loader,
) {
  clearContext(ctx);
  drawBox(ctx, elem, elem.desc.bgColor || 'transparent');
  rotateElement(ctx, elem, () => {

    const desc: TypeElemDescText = {
      ...{
        fontSize: 12,
        fontFamily: 'sans-serif',
        textAlign: 'center',
      },
      ...elem.desc
    };
    ctx.setFillStyle(elem.desc.color);
    ctx.setTextBaseline('top');
    ctx.setFont({
      fontWeight: desc.fontWeight,
      fontSize: desc.fontSize,
      fontFamily: desc.fontFamily
    });
    const descText = desc.text.replace(/\r\n/ig, '\n');
    const fontHeight = desc.lineHeight || desc.fontSize;
    const descTextList = descText.split('\n');
    const lines: { text: string, width: number }[] = [];

    // 如果配置了maxWidth, 肯定只有一行内容...
    if (desc.maxWidth) {
      const lineText = descTextList.join('');

      if (fontHeight <= elem.h) {
        lines.push({
          text: lineText,
          width: ctx.calcScreenNum(ctx.measureText(lineText).width)
        });
      }
    } else {
      let lineNum = 0;
      descTextList.forEach((tempText, idx) => {
        let lineText = '';

        // 使空白行可以继续运行后面的逻辑
        if (!tempText) {
          tempText = ' '
        }

        for (let i = 0; i < tempText.length; i++) {
          if (ctx.measureText(lineText + (tempText[i] || '')).width < ctx.calcDeviceNum(elem.w)) {
            lineText += (tempText[i] || '');
          } else {
            lines.push({
              text: lineText,
              width: ctx.calcScreenNum(ctx.measureText(lineText).width),
            });
            lineText = (tempText[i] || '');
            lineNum++;
          }
          if ((lineNum + 1) * fontHeight > elem.h) {
            break;
          }
          if (lineText && tempText.length - 1 === i) {
            if ((lineNum + 1) * fontHeight <= elem.h) {
              lines.push({
                text: lineText,
                width: ctx.calcScreenNum(ctx.measureText(lineText).width),
              });
              // 不是最后一段...这里 lineNum 也要加一...解决存在换行场景时超出换行的异常
              if (idx < descTextList.length - 1) {
                lineNum++;
              }
              break;
            }
          }
        }
      });
    }


    // draw text lines
    {
      let _y = elem.y;
      if (lines.length * fontHeight < elem.h) {
        _y += ((elem.h - lines.length * fontHeight) / 2);
      }
      if (desc.textShadowColor !== undefined && color.isColorStr(desc.textShadowColor)) {
        ctx.setShadowColor(desc.textShadowColor);
      }
      if (desc.textShadowOffsetX !== undefined && is.number(desc.textShadowOffsetX)) {
        ctx.setShadowOffsetX(desc.textShadowOffsetX);
      }
      if (desc.textShadowOffsetY !== undefined && is.number(desc.textShadowOffsetY)) {
        ctx.setShadowOffsetY(desc.textShadowOffsetY);
      }
      if (desc.textShadowBlur !== undefined && is.number(desc.textShadowBlur)) {
        ctx.setShadowBlur(desc.textShadowBlur);
      }
      lines.forEach((line, i) => {
        let _x = elem.x;
        // 配置了maxWidth 且 文本长度 > maxWidth，则文本要缩小
        const shoudScaleText = desc.maxWidth && elem.w < line.width;
        if (desc.textAlign === 'center' && !shoudScaleText) {
          _x = elem.x + (elem.w - line.width) / 2;
        } else if (desc.textAlign === 'right' && !shoudScaleText) {
          _x = elem.x + (elem.w - line.width);
        }
        ctx.fillText(line.text, _x, _y + fontHeight * i, desc.maxWidth ? elem.w : undefined);
      });
      clearContext(ctx);
    }

    // draw text stroke
    if (color.isColorStr(desc.strokeColor) && desc.strokeWidth !== undefined && desc.strokeWidth > 0) {
      let _y = elem.y;
      if (lines.length * fontHeight < elem.h) {
        _y += ((elem.h - lines.length * fontHeight) / 2);
      }
      lines.forEach((line, i) => {
        let _x = elem.x;
        if (desc.textAlign === 'center') {
          _x = elem.x + (elem.w - line.width) / 2;
        } else if (desc.textAlign === 'right') {
          _x = elem.x + (elem.w - line.width);
        }
        if (desc.strokeColor !== undefined) {
          ctx.setStrokeStyle(desc.strokeColor);
        }
        if (desc.strokeWidth !== undefined && desc.strokeWidth > 0) {
          ctx.setLineWidth(desc.strokeWidth);
        }
        ctx.strokeText(line.text, _x, _y + fontHeight * i);
      });
    }

  });
}



// export function createTextSVG(elem: TypeElement<'text'>): string {
//   const svg = `
//   <svg xmlns="http://www.w3.org/2000/svg" width="${elem.w}" height = "${elem.h}">
//     <foreignObject width="100%" height="100%">
//       <div xmlns = "http://www.w3.org/1999/xhtml" style="font-size: ${elem.desc.size}px; color:${elem.desc.color};">
//         <span>${elem.desc.text || ''}</span>
//       </div>
//     </foreignObject>
//   </svg>
//   `;
//   return svg;
// }


