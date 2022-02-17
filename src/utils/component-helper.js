import ComponentList from "./component-list";
import React, { useRef } from 'react';

import Sprite from "./sprite-utils";

export default class ComponentHelper {

    constructor(component) {
        ComponentList.components[component.uid] = this;
        this.component = component;

    }

    getParent() {
        return ComponentList.components[this.component.parent] || null;
    }

    async build(canvas) {
        let component = this.component;
        let context = canvas.getContext('2d');

        let width = component.width;
        let height = component.height;
        let x = this.getX();
        let y = this.getY();

        let parent = this.getParent();

        if (parent != null) {
            if (width > parent.component.width)
                width = parent.component.width;
            if (height > parent.component.height)
                height = parent.component.height;
            if (component.positionX < 0)
                component.positionX = 0;
            if (component.positionX + width > parent.component.width)
                component.positionX = parent.component.width - width;
            if (component.positionY < 0)
                component.positionY = 0;
            if (component.positionY + height > parent.component.height)
                component.positionY = parent.component.height - height;
        }

        if (component.type === 'SPRITE' && component.spriteId !== -1) {
            if (component.sprite)
                context.drawImage(component.sprite, x, y, width, height);
        } else if (component.type === 'TEXT') {
            let metrics = context.measureText(component.text);
            let colour = component.color;
            let r = 0,
                g = 0,
                b = 0;
            if (colour != 0) {
                r = colour >> 16;
                g = colour >> 8 & 0xFF;
                b = colour & 0xFF;
            }
            context.font = '11px Helvetica';
            context.fillStyle = `rgb(${r}, ${g}, ${b})`;
            let fontHeight = parseInt(context.font);
            let parent = this.getParent();
            if (!parent)
                context.fillText(component.text,
                    component.positionX + component.width / 2 - metrics.width / 2,
                    component.positionY + component.height / 2 + fontHeight / 2
                );
            else {
                if (component.baseWidth === 0 && component.baseHeight === 0) {
                    let realX = parent.component.positionX + (parent.component.width - metrics.width) / 2;
                    let realY = parent.component.positionY + ((parent.component.height - fontHeight) / 2) + fontHeight; //ascent
                    context.fillText(component.text, realX, realY);
                } else {
                    let realX = this.getX();
                    let realY = this.getY();
                    if (realX > parent.component.width + parent.component.positionX)
                        realX = parent.component.width - component.width;

                    context.fillText(component.text,
                        realX + component.width / 2 - metrics.width / 2,
                        realY + component.height / 2 + fontHeight / 2
                    );
                }
            }
            //create proper metrics
        } else if (component.type === 'CONTAINER') {
            // console.log('container');
        } else if (component.type === 'FIGURE') {
            let colour = component.color;
            let r = 0,
                g = 0,
                b = 0;
            if (colour != 0) {
                r = colour >> 16;
                g = colour >> 8 & 0xFF;
                b = colour & 0xFF;
            }
            context.fillStyle = `rgb(${r}, ${g}, ${b})`;
            context.rect(x, y, component.width, component.height);
            if (component.filled)
                context.fill();
            else
                context.stroke();
        } else if (component.type === 'MODEL') {
            context.fillStyle = 'blue';
            context.fillRect(this.getX(), this.getY(), component.width, component.height);
        }

    }

    getX() {
        let parent = this.getParent();
        if (!parent) return this.component.positionX;
        let x = this.component.positionX;
        while (parent != null) {
            x += parent.component.positionX;
            parent = parent.getParent();
        }
        return x;
    }

    getY() {
        let parent = this.getParent();
        if (!parent) return this.component.positionY;
        let y = this.component.positionY;
        while (parent != null) {
            y += parent.component.positionY;
            parent = parent.getParent();
        }
        return y;
    }

    hasChildren() {
        for (let uid of Object.keys(ComponentList.components)) {
            let helper = ComponentList.components[uid];
            if (helper.component.parent === this.component.uid)
                return true;
        }
        return false;
    }

    getChildren() {
        let children = [];
        for (let uid of Object.keys(ComponentList.components)) {
            let helper = ComponentList.components[uid];
            if (helper.component.parent === this.component.uid)
                children.push(helper);
        }
        return children;
    }

    async loadSprite() {
        let component = this.component;
        return new Promise(async(resolve, reject) => {

            let base64data = await api.file.getImage(`/sprites/${component.spriteId}/${component.spriteId}_0.png`);

            let image = new Image();
            image.src = base64data;
            image.onload = () => {
                component.sprite = image;
                resolve();
            }
            image.onerror = reject;
        });
    }

    setValues() {
        let parent = this.getParent();
        let width, height;
        if (!parent) {
            width = 520;
            height = 339;
        } else {
            parent.setValues();
            width = parent.component.width;
            height = parent.component.height;
        }
        this.setRealAfmeting(width, height);
        this.setRealPosition(width, height);
    }

    isScrollBar() {
        return this.component.onLoadScript && this.component.onLoadScript.length &&
            this.component.onLoadScript[0] === 30;
    }

    isButton() {
        return this.component.onLoadScript && this.component.onLoadScript.length &&
            this.component.onLoadScript[0] === 92;
    }

    setRealAfmeting(width, height) {
        let component = this.component;
        switch (component.aspectWidthType) {
            case 0:
                component.width = component.baseWidth;
                break;
            case 1:
                component.width = width - component.baseWidth;
                break;
            case 2:
                component.width = width * component.baseWidth >> 14;
                break;
        }
        switch (component.aspectHeightType) {
            case 0:
                component.height = component.baseHeight;
                break;
            case 1:
                component.height = height - component.baseHeight;
                break;
            case 2:
                component.height = height * component.baseHeight >> 14;
                break;
        }
        if (component.type === 'CONTAINER') {
            if (component.height < 5 && component.width < 5) {
                component.height = 5;
                component.width = 5;
            } else {
                if (component.height <= 0)
                    component.height = 5;
                if (component.width <= 0)
                    component.width = 5;
            }
        }
    }

    setRealPosition(parentWidth, parentHeight) {
        let component = this.component;

        if (component.aspectXType === 0)
            component.positionX = component.basePositionX;
        else if (component.aspectXType === 1)
            component.positionX = ((component.basePositionX + (parentWidth - component.width) / 2));
        else if (2 == component.aspectXType)
            component.positionX = (parentWidth - component.width - component.basePositionX);
        else if (component.aspectXType == 3)
            component.positionX = (parentWidth * (component.basePositionX) >> 14);
        else if (component.aspectXType == 4)
            component.positionX = ((parentWidth - component.width) / 2 + (parentWidth * (component.basePositionX) >> 14));
        else
            component.positionX = (parentWidth - component.width - (component.basePositionX * parentWidth >> 14));

        if (component.aspectYType == 0)
            component.positionY = component.basePositionY;
        else if (component.aspectYType == 1)
            component.positionY = ((component.basePositionY + (parentHeight - component.height) / 2));
        else if (component.aspectYType == 2)
            component.positionY = (parentHeight - component.height - component.basePositionY);
        else if (3 == component.aspectYType)
            component.positionY = (component.basePositionY * parentHeight >> 14);
        else if (component.aspectYType == 4)
            component.positionY = (((component.basePositionY * parentHeight >> 14) + (parentHeight - component.height) / 2));
        else
            component.positionY = (parentHeight - component.height - (component.basePositionY * parentHeight >> 14));

        if (component.positionX < 0)
            component.positionX = 0;
        if ((component.positionX + component.width) > parentWidth)
            component.positionX = (parentWidth - component.width);
        if (component.positionY < 0) component.positionY = 0;
        if ((component.positionY + component.height) > parentHeight)
            component.positionY = (parentHeight - component.height);
    }
}