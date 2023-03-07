
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    /** ndoeItem */
    @property(cc.Node)
    ndoeItem: cc.Node = null;
    /** ndoeContent */
    @property(cc.Node)
    ndoeContent: cc.Node = null;
    /** editBox0 */
    @property(cc.EditBox)
    editBox0: cc.EditBox = null;
    /** editBox1 */
    @property(cc.EditBox)
    editBox1: cc.EditBox = null;

    /** sprTest */
    @property(cc.Sprite)
    sprTest: cc.Sprite = null;
    /** materiaGray */
    @property(cc.Material)
    materiaGray: cc.Material = null;
    /** materiaGray */
    @property(cc.Material)
    materiaNormal: cc.Material = null;

    /**颜色数组 */
    private _colorArr: cc.Color[] = [new cc.Color().fromHEX("#FF0000"), new cc.Color().fromHEX("#00FF00"),
    new cc.Color().fromHEX("#0000FF"), new cc.Color().fromHEX("#FFFF00"), new cc.Color().fromHEX("#00FFFF")];

    /** 概率标记X */
    private _tagX: number = 0;
    /** 概率标记Y */
    private _tagY: number = 0;

    /**已有颜色信息 */
    private _curColorInfo: Map<string, number> = new Map();

    /**是否是一次新的触摸 */
    private _isNewTouch: boolean = true;

    /* start*/
    protected start(): void {
        this.sprTest.node.scale = 0;
        let tmpTween = cc.tween().to(0.3, { scale: 1 }, { easing: 'cubicIn' });
        cc.tween(this.sprTest.node).then(tmpTween).call(() => {
            this.startSptTestAni();
        }).start();
        this.ndoeItem.active = false;
        this.sprTest.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.sprTest.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchEnd, this);
        this.sprTest.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
    }

    private _touchStart(): void {
        this._isNewTouch = true;
        cc.Tween.stopAllByTarget(this.sprTest.node);
        cc.tween(this.sprTest.node).to(0.2, { scale: 0.8 }, { easing: 'elasticIn' }).to(0.05, { scale: 0.78 }, { easing: 'elasticIn' })
            .to(0.05, { scale: 0.8 }, { easing: 'elasticIn' }).start();
        this.sprTest.setMaterial(0, this.materiaGray);
    }
    private _touchEnd(): void {
        if (this._isNewTouch) {
            this._isNewTouch = false;
            cc.Tween.stopAllByTarget(this.sprTest.node);
            cc.tween(this.sprTest.node).to(0.2, { scale: 1 }, { easing: 'elasticIn' }).to(0.05, { scale: 1.02 }, { easing: 'elasticIn' })
                .to(0.05, { scale: 1 }, { easing: 'elasticIn' }).call(() => {
                    this.startSptTestAni();
                }).start();
            this.sprTest.setMaterial(0, this.materiaNormal);
            this.onBtnCreate();
        }
    }

    public startSptTestAni(): void {
        cc.Tween.stopAllByTarget(this.sprTest.node);
        this.sprTest.node.scale = 1;
        let tmpTween = cc.tween().to(0.3, { scale: 1.04 },).to(0.3, { scale: 1 })
            .to(0.3, { scale: 0.96 }).to(0.3, { scale: 1 });
        cc.tween(this.sprTest.node).then(tmpTween).repeatForever().start();
    }

    /**c生成10 × 10 矩阵 */
    public onBtnCreate(): void {
        console.log("tag", this.checkNum([10, 40, 5, 280], [234, 5, 2, 148, 23], 42));
        this._tagX = Number(this.editBox0.textLabel.string);
        if (Number.isNaN(this._tagX)) {
            this._tagX = 0;
        } else {
            this._tagX = Math.abs(this._tagX);
        }
        this._tagY = Number(this.editBox1.textLabel.string);
        if (Number.isNaN(this._tagY)) {
            this._tagY = 0;
        } else {
            this._tagY = Math.abs(this._tagY);
        }
        this.ndoeContent.destroyAllChildren();
        for (let x = 1; x <= 10; x++) {
            for (let y = 1; y <= 10; y++) {
                this.ndoeContent.children
                let tmpNode = cc.instantiate(this.ndoeItem);
                tmpNode.active = true;
                let dex = this.getColorDex(x, y);
                tmpNode.color = this._colorArr[dex];
                this._curColorInfo.set(x + "_" + y, dex + 1);
                tmpNode.getChildByName("lbaPos").getComponent(cc.Label).string = x + "_" + y;
                this.ndoeContent.addChild(tmpNode);
            }

        }

    }

    /**
     * 获取颜色下标
     * @param x 节点x值
     * @param y 节点y值
     * @returns 颜色dex
     */
    public getColorDex(x: number, y: number): number {
        if (x === 1 && y === 1) {
            let dex = this.getInt(0, 4);
            return dex;
        } else {
            let dex = this.getInt(1, 100);
            let tag1 = x + "_" + (y - 1);
            let tag2 = (x - 1) + "_" + y;
            let tagNum = 100;
            let tmpArr = [0, 0, 0, 0, 0];
            let addNum = 0;
            let tagColor1 = this._curColorInfo.get(tag1);
            let tagColor2 = this._curColorInfo.get(tag2);
            if (tagColor1 == tagColor2) {
                tmpArr[tagColor1 - 1] = 20 + this._tagY;
                if (tmpArr[tagColor1 - 1] >= 100) {
                    return tagColor1 - 1;
                } else {
                    tagNum -= 20 + this._tagY;
                    addNum++;
                }
            } else {
                if (tagColor1 && this._tagX) {
                    tmpArr[tagColor1 - 1] = 20 + this._tagX;
                    if (tmpArr[tagColor1 - 1] >= 100) {
                        return tagColor1 - 1;
                    } else {
                        tagNum -= 20 + this._tagX;
                        addNum++;
                    }
                }
                if (tagColor2 && this._tagY) {
                    tmpArr[tagColor2 - 1] = 20 + this._tagY;
                    if (tmpArr[tagColor2 - 1] >= 100) {
                        return tagColor2 - 1;
                    } else {
                        tagNum -= 20 + this._tagY;
                        addNum++;
                    }
                }
            }
            let subTag = Math.ceil(tagNum / (5 - addNum));
            for (let index = 0; index < tmpArr.length; index++) {
                if (tmpArr[index] == 0) {
                    tmpArr[index] = subTag;
                }
            }
            for (let index = 0; index < tmpArr.length; index++) {
                let lastNum = 0;
                for (let index2 = 0; index2 < index; index2++) {
                    lastNum += tmpArr[index2];
                }
                let leftNum = index == 0 ? lastNum + 1 : lastNum + 1;
                let rightNum = leftNum + tmpArr[index] - 1;
                if (dex >= leftNum &&
                    dex <= rightNum) {
                    return index;
                }

            }
            console.log("");
        }
    }



    /**
     * 获取一个整数随机数
     * @param {number} min 
     * @param {number} max 
     */
    public getInt(min: number, max: number): number {
        return Math.round((Math.random() * (max - min)) + min);
    }





    /**
     * 问题2查找数字     复杂度O(n^2)
     * @param arr1 
     * @param arr2 
     * @param tagNum 
     * @returns 
     */
    public checkNum(arr1: number[], arr2: number[], tagNum: number): boolean {
        let ifFond = false;
        for (let index = 0; index < arr1.length; index++) {
            let element1 = arr1[index];
            for (let index2 = 0; index2 < arr2.length; index2++) {
                let element2 = arr2[index2];
                if (element1 + element2 == tagNum) {
                    ifFond = true;
                    break;
                }
            }
            if (ifFond) {
                break;
            }
        }
        return ifFond;
    }



}
