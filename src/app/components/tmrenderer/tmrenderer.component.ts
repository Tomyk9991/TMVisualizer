import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {TMRendererService} from "../../services/t-m-renderer.service";
import TuringMachine from "../../../model/TM/TuringMachine";
import StateDrawer from "./Drawers/StateDrawer";
import TransitionDrawer from "./Drawers/TransitionDrawer";
import IDrawer from "./Drawers/IDrawer";
import Transition from "../../../model/TM/Transition";
import State from "../../../model/TM/State";

@Component({
    selector: 'app-tmrenderer',
    templateUrl: './tmrenderer.component.html',
    styleUrls: ['./tmrenderer.component.css']
})
export class TMRendererComponent implements OnInit, AfterViewInit {
    private p5?: p5;

    static p5?: p5;
    static screenHeight: number = 0;
    static screenWidth: number = 0;
    static TM?: TuringMachine;

    constructor(private renderer: TMRendererService) {
        this.getScreenSize();
        this.renderer.OnRegisterRender.on((data: TuringMachine) => {
            TMRendererComponent.TM = data;
        })
    }


    @HostListener('window:resize', ['$event'])
    getScreenSize(event?: any) {
        TMRendererComponent.screenWidth = window.innerWidth - 15;
        TMRendererComponent.screenHeight = window.innerHeight - 70;
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
            p.ellipseMode(p.CENTER);
            p.textAlign(p.CENTER, p.CENTER);

            let tm: TuringMachine = <TuringMachine>TMRendererComponent.TM;

            console.log(tm);

            for (let i = 0; i < tm.states.length; i++) {
                // let x: number = <number>TMRendererComponent.p5?.random(50, TMRendererComponent.screenWidth - 50);
                // let y: number = <number>TMRendererComponent.p5?.random(50,  TMRendererComponent.screenHeight - 50);
                let margin: number = 60;
                let x: number = <number>TMRendererComponent.p5?.map(i, 0, tm.states.length - 1, margin, TMRendererComponent.screenWidth - margin);
                let y: number = TMRendererComponent.screenHeight / 2;

                let pos: p5.Vector = <p5.Vector>TMRendererComponent.p5?.createVector(x, y);

                let stateDrawer: StateDrawer = new StateDrawer(tm.states[i], pos);
                stateDrawers.push(stateDrawer);
                drawQueue.push(stateDrawer);
            }

            for (let i = 0; i < tm.transitions.length; i++) {
                let currentStateDrawer: StateDrawer = <StateDrawer>stateDrawers.find((drawer: StateDrawer) => drawer.state === tm.transitions[i].currentState);
                let nextStateDrawer: StateDrawer = <StateDrawer>stateDrawers.find((drawer: StateDrawer) => drawer.state === tm.transitions[i].nextState);

                let transitionDrawer: TransitionDrawer = new TransitionDrawer(tm.transitions[i], currentStateDrawer, nextStateDrawer, <p5>TMRendererComponent.p5);

                transitionsDrawers.push(transitionDrawer);
                drawQueue.push(transitionDrawer);
        };
            }
        p.draw = () => {
            draw(p);
        };
    }
}

// TM
let stateDrawers: StateDrawer[] = [];
let transitionsDrawers: TransitionDrawer[] = [];

let drawQueue: IDrawer[] = [];

function draw(p: any): void {
    p.background('#303030');

    for (let i = 0; i < drawQueue.length; i++) {
        drawQueue[i].draw(p, <p5>TMRendererComponent.p5);
    }
}
