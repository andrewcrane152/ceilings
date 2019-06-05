import { Injectable } from '@angular/core';

export class GridSection {
  row: number;
  column: number;
  backgroundImage: string;
  texture: string;
  rotation: number;
  material: string;
  tile: string;
  tileSize: string;
  gridTileID: number;

  constructor(
    _row: number,
    _column: number,
    _backgroundImage: string = '',
    _texture: string = '',
    _rotation: number = 0,
    _material: string = '',
    _tile: string = '',
    _tileSize: string = '',
    _tileNumber: number = 0
  ) {
    this.setBackgroundImage(_backgroundImage);
    this.setTexture(_texture);
    this.setRotation(_rotation);
    this.setMaterial(_material);
    this.setTile(_tile);
    this.setRow(_row);
    this.setColumn(_column);
    this.setTileSize(_tileSize);
    this.setgridTileID(_tileNumber);
  }

  //               __  __
  //    ________  / /_/ /____  __________
  //   / ___/ _ \/ __/ __/ _ \/ ___/ ___/
  //  (__  )  __/ /_/ /_/  __/ /  (__  )
  // /____/\___/\__/\__/\___/_/  /____/

  setRow(row: number) {
    this.row = row;
  }

  setColumn(column: number) {
    this.column = column;
  }

  setBackgroundImage(url: string) {
    this.backgroundImage = url;
  }

  setTexture(texture: string) {
    this.texture = texture;
  }

  setRotation(value: number) {
    this.rotation = value;
  }

  setMaterial(material: string) {
    this.material = material;
  }

  setTile(type: string) {
    this.tile = type;
  }

  setTileSize(size: string) {
    this.tileSize = size;
  }

  setgridTileID(num: number) {
    this.gridTileID = num;
  }

  //                __  __
  //    ____ ____  / /_/ /____  __________
  //   / __ `/ _ \/ __/ __/ _ \/ ___/ ___/
  //  / /_/ /  __/ /_/ /_/  __/ /  (__  )
  //  \__, /\___/\__/\__/\___/_/  /____/
  // /____/

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.column;
  }

  getBackgroundImage() {
    return this.backgroundImage;
  }

  getRotation() {
    return this.rotation;
  }

  getMaterial() {
    return this.material;
  }

  getTile() {
    return this.tile;
  }

  getTileSize() {
    return this.tileSize;
  }

  getTileNumber() {
    return this.gridTileID;
  }
}
