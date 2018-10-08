export interface DragHandler {
  onDrag(event: DragEvent): void;
  onDragStart(event: DragEvent, data: any): void;
  onDragOver(event: DragEvent): void;
  onDragLeave(event: DragEvent): void;
  onDragEnd(event: DragEvent): void;
  onDrop(event: DragEvent): void;
}
