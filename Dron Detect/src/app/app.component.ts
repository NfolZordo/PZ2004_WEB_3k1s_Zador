import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'my-appqq',
  template: `<canvas #myCanvas></canvas>`
})

export class AppComponent implements AfterViewInit {
  @ViewChild('myCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  asd : boolean;
  infoRadar: { distanceRadar: number; angleRadar: number } ;

  ngAfterViewInit(): void {
    const canvas = this.myCanvas.nativeElement;
    const context = this.myCanvas.nativeElement.getContext('2d');
    canvas.width = 1000;
    canvas.height = 900;
    let countText;
    let mouse = { x: 0, y: 0 };
    let draw: boolean = false;
    const radar1 = { x: 100, y: 80 };
    const radar2 = { x: 650, y: 80 };
    const radar3 = { x: 100, y: 650 };
    const radar4 = { x: 650, y: 650 };
    drawTable();
    canvas.addEventListener("mouseup", function (e) {
      context.fillStyle = "#fff";
      context.fillRect(0,0,9999,9999);
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      context.beginPath();
      let dron = context.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2, false);
      context.fillStyle = "red";
      context.fill()
      context.stroke();
      context.closePath();
      drawTable();
      context.font = "20px Arial";
      context.fillStyle = "#000";
      countText = 0;
      addText(calculateDistance(radar1, radar2, mouse),calculateAngle(mouse, radar1));
      addText(calculateDistance(radar2, radar4, mouse),calculateAngle(mouse, radar2));
      addText(calculateDistance(radar3, radar1, mouse),calculateAngle(mouse, radar3));
      addText(calculateDistance(radar4, radar3, mouse),calculateAngle(mouse, radar4));
      draw = false;
    });

    function addText(distance:number, angle: number) {
      countText++;
      context.fillText("Відстань до радара №" + countText + " " + distance.toFixed(2)
       + ", азимут " + angle.toFixed(2) ,10,800 + countText * 20);
    }

    function calculateAngle(dronСoordinates, radarСoordinates) {
      let azimuth: number;
      let angle: number;
      angle = Math.atan((dronСoordinates.y - radarСoordinates.y)
        / (dronСoordinates.x - radarСoordinates.x)) * 180 / Math.PI;

      if (dronСoordinates.x >= radarСoordinates.x) {
        azimuth = 90 + angle
      }
      else {
        azimuth = 270 + angle
      }
      return (azimuth);
    }

    function drawTable() {
      for (let x = 0.5; x < canvas.width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height-100);
      }

      for (let y = 0.5; y < canvas.height-100; y += 10) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }
      context.stroke();
      context.beginPath();
      context.arc(radar1.x, radar1.y, 6, 0, Math.PI * 2);
      context.fillStyle = "green";
      context.fill()
      context.closePath();
      context.stroke();
  
      context.stroke();
      context.beginPath();
      context.arc(radar2.x, radar2.y, 6, 0, Math.PI * 2);
      context.fillStyle = "green";
      context.fill()
      context.closePath();
      context.stroke();
  
      context.stroke();
      context.beginPath();
      context.arc(radar3.x, radar3.y, 6, 0, Math.PI * 2);
      context.fillStyle = "green";
      context.fill()
      context.closePath();
      context.stroke();
  
      context.stroke();
      context.beginPath();
      context.arc(radar4.x, radar4.y, 6, 0, Math.PI * 2);
      context.fillStyle = "green";
      context.fill()
      context.closePath();
      context.stroke();
    }

    function calculateTriangleAngle(radarСoordinates1, radarСoordinates2, dronСoordinates) {
      let angle: number;
      let side1: number = Math.sqrt(Math.pow((radarСoordinates2.y - radarСoordinates1.y), 2) + Math.pow((radarСoordinates2.x - radarСoordinates1.x), 2));
      let side2: number = Math.sqrt(Math.pow((dronСoordinates.y - radarСoordinates1.y), 2) + Math.pow((dronСoordinates.x - radarСoordinates1.x), 2));
      let side3: number = Math.sqrt(Math.pow((dronСoordinates.y - radarСoordinates2.y), 2) + Math.pow((dronСoordinates.x - radarСoordinates2.x), 2));
      angle = Math.acos(((side2 * side2) + (side3 * side3) - (side1 * side1)) / (2 * side2 * side3)) * 180 / Math.PI;
      return angle;
    }

    function calculateDistance(radarСoordinates1, radarСoordinates2, dronСoordinates) {
      let distance: number;
      let angleRadar1: number = calculateTriangleAngle(dronСoordinates, radarСoordinates1, radarСoordinates2);
      let angleRadar2: number = calculateTriangleAngle(dronСoordinates, radarСoordinates2, radarСoordinates1)
      let angleThird: number = 180 - angleRadar1 - angleRadar2;

      let distanceBetweenRadars: number = Math.sqrt(Math.pow((radarСoordinates1.x - radarСoordinates2.x), 2)
        + Math.pow((radarСoordinates1.y - radarСoordinates2.y), 2));
      distance = (distanceBetweenRadars * Math.sin(angleRadar1 / 180 * Math.PI))
        / Math.sin(angleThird / 180 * Math.PI);
      return (Math.abs(distance));
    }
  }
}

