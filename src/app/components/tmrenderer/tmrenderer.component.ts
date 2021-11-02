import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {TMRendererService} from "../../services/t-m-renderer.service";
import TuringMachine from "../../../model/TM/TuringMachine";
import StateDrawer from "./Drawers/StateDrawer";
import TransitionDrawer from "./Drawers/TransitionDrawer";
import TextDescriptionDrawer from "./Drawers/TextDescriptionDrawer";
import RenderPipelineManager from "./Drawers/managers/RenderPipelineManager";
import DrawerManager from "./Drawers/managers/DrawerManager";
import InteractableManager from "./Drawers/managers/InteractableManager";
import KeyboardCallbackManager from "./Drawers/managers/KeyboardCallbackManager";
import StateEditorService from "../../services/state-editor.service";
import CreateStateCreater from "./KeyboardCallbackInstances/CreateStateCreater";
import RemoveStateRemover from "./KeyboardCallbackInstances/RemoveStateRemover";
import Transition from "../../../model/TM/Transition";

@Component({
    selector: 'app-tmrenderer',
    templateUrl: './tmrenderer.component.html',
    styleUrls: ['./tmrenderer.component.css']
})
export class TMRendererComponent implements OnInit, AfterViewInit {
    private p5?: p5;

    static p5?: p5;
    static p: any;
    static screenHeight: number = 0;
    static screenWidth: number = 0;
    static TM?: TuringMachine;
    static stateEditorService: StateEditorService;
    static tmRendererService: TMRendererService;

    constructor(stateEditorService: StateEditorService, private rendererNotifier: TMRendererService) {
        this.getScreenSize();
        TMRendererComponent.tmRendererService = rendererNotifier;
        this.rendererNotifier.OnRegisterRender.on((data: TuringMachine) => {
            if (CreateStateCreater.statePosition !== undefined) {
                statePositions.push(CreateStateCreater.statePosition);
                CreateStateCreater.statePosition = undefined;
            }

            TMRendererComponent.TM = data;
            if (TMRendererComponent.p !== undefined) {
                resetSketch(TMRendererComponent.p, false);
            }
        });
        TMRendererComponent.stateEditorService = stateEditorService;
    }


    @HostListener('window:resize', ['$event'])
    getScreenSize(event?: any) {
        let previousWidth = TMRendererComponent.screenWidth;
        let previousHeight = TMRendererComponent.screenHeight;

        TMRendererComponent.screenWidth = window.innerWidth - 15;
        TMRendererComponent.screenHeight = window.innerHeight - 70;

        if (TMRendererComponent.p !== undefined) {
            TMRendererComponent.p.resizeCanvas(TMRendererComponent.screenWidth, TMRendererComponent.screenHeight);
            // recalculate position of states with new screen size
            for (let i = 0; i < statePositions.length; i++) {
                statePositions[i].x = (statePositions[i].x / previousWidth) * TMRendererComponent.screenWidth;
                statePositions[i].y = (statePositions[i].y / previousHeight) * TMRendererComponent.screenHeight;
            }
            resetSketch(TMRendererComponent.p, false);
        }
    }

    ngAfterViewInit(): void {
        this.createCanvas();
    }

    ngOnInit() {
    }

    private createCanvas() {
        this.p5 = new p5(this.sketch);
        TMRendererComponent.p5 = this.p5;
    }

    private sketch(p: any) {
        p.setup = () => {
            p.createCanvas(TMRendererComponent.screenWidth, TMRendererComponent.screenHeight);
            TMRendererComponent.p = p;
            resetSketch(p, true);
        };
        p.draw = () => {
            draw(p);
        };

        p.keyPressed = (event: any) => {
            for (let i = 0; i < KeyboardCallbackManager.callbacks.length; i++) {
                KeyboardCallbackManager.callbacks[i].keyPressed(<p5>TMRendererComponent.p5, event.key.toLowerCase());
            }
        };
    }
}

// TM
let stateDrawers: StateDrawer[] = [];
let transitionsDrawers: TransitionDrawer[] = [];

let statePositions: p5.Vector[] = [];

export function removePosition(vec: p5.Vector): void {
    statePositions = statePositions.filter(p => p !== vec);
}

function resetSketch(p: any, resetPositions: boolean): void {
    //reset systems
    RenderPipelineManager.rpcs = [];
    InteractableManager.interactables = [];
    DrawerManager.drawQueue = [];
    KeyboardCallbackManager.callbacks = [];

    let stateDrawers: StateDrawer[] = [];
    let transitionsDrawers: TransitionDrawer[] = [];


    p.ellipseMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);

    let tm: TuringMachine = <TuringMachine>TMRendererComponent.TM;
    let renderer: TMRendererService = TMRendererComponent.tmRendererService;

    // Objects registered in manager singleton
    new TextDescriptionDrawer();
    new CreateStateCreater(tm, renderer);
    new RemoveStateRemover(tm, renderer);

    if (resetPositions) {
        statePositions = [];
    }

    for (let i = 0; i < tm.states.length; i++) {
        // let x: number = <number>TMRendererComponent.p5?.random(50, TMRendererComponent.screenWidth - 50);
        // let y: number = <number>TMRendererComponent.p5?.random(50,  TMRendererComponent.screenHeight - 50);
        let margin: number = 60;
        let x: number = <number>TMRendererComponent.p5?.map(i, 0, tm.states.length - 1, margin, TMRendererComponent.screenWidth - margin);
        let y: number = TMRendererComponent.screenHeight / 2;

        if (resetPositions) {
            statePositions.push(<p5.Vector>TMRendererComponent.p5?.createVector(x, y));
        }


        let pos: p5.Vector = statePositions[i];

        let stateDrawer: StateDrawer = new StateDrawer(TMRendererComponent.stateEditorService, tm, tm.states[i], pos);
        stateDrawers.push(stateDrawer);
    }

    for (let i = 0; i < tm.transitions.length; i++) {
        let currentStateDrawer: StateDrawer = <StateDrawer>stateDrawers.find((drawer: StateDrawer) => drawer.state == tm.transitions[i].currentState);
        let nextStateDrawer: StateDrawer = <StateDrawer>stateDrawers.find((drawer: StateDrawer) => drawer.state == tm.transitions[i].nextState);

        let transitionDrawer: TransitionDrawer = new TransitionDrawer(tm.transitions[i], currentStateDrawer, nextStateDrawer, <p5>TMRendererComponent.p5);
        transitionsDrawers.push(transitionDrawer);
    }
}

function draw(p: any): void {
    p.background('#303030');

    for (let i = 0; i < RenderPipelineManager.rpcs.length; i++) {
        RenderPipelineManager.rpcs[i].onStartFrame();
    }

    for (let i = 0; i < InteractableManager.interactables.length; i++) {
        InteractableManager.interactables[i].interact(p, <p5>TMRendererComponent.p5);
    }

    for (let i = 0; i < DrawerManager.drawQueue.length; i++) {
        DrawerManager.drawQueue[i].draw(p, <p5>TMRendererComponent.p5);
    }

    for (let i = 0; i < RenderPipelineManager.rpcs.length; i++) {
        RenderPipelineManager.rpcs[i].onFinishFrame();
    }
}
