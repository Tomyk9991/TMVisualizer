export default interface IRenderPipelineComponent {
    onStartFrame(): void;
    onFinishFrame(): void;
}
