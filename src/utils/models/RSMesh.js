import * as THREE from 'three';

import InStream from '../io/instream';

import hslToRGB from '../colour-utils';

export default class RSMesh {

    constructor(data, count) {
        this.version = 12;
        this.vertexCount = 0;
        this.maxDepth = 0;
        this.faceCount = 0;
        this.priority = -1;
        this.texturedFaceCount = 0;
        if (count) {
            this.combineMeshes(data, count);
            return;
        }
        this.data = data;
        if (this.isNewFormat())
            this.decodeNewFormat();
        else
            this.decodeOldFormat();
    }

    isNewFormat() {
        let array = new Int8Array(this.data.length);
        array.set(this.data);
        return array[array.length - 1] === -1 && array[array.length - 2] === -1;
    }

    combineMeshes(meshes, count) {
        this.vertexCount = 0;
        this.faceCount = 0;
        this.texturedFaceCount = 0;
        let i_3 = 0;
        let i_4 = 0;
        let i_5 = 0;
        let bool_6 = false;
        let bool_7 = false;
        let hasFaceAlphas = false;
        let hasTexturePos = false;
        let hasFaceTextures = false;
        let hasTextureSkins = false;
        this.priority = -1;

        for (let i = 0; i < count; i++) {
            let mesh = meshes[i];
            if (!mesh) continue;

            this.vertexCount += mesh.vertexCount;
            this.faceCount += mesh.faceCount;
            this.texturedFaceCount += mesh.texturedFaceCount;
            if (mesh.particleConfigs)
                i_3 += mesh.particleConfigs.length;

            if (mesh.surfaceSkins)
                i_4 += mesh.surfaceSkins.length;

            if (mesh.isolatedVertexNormals)
                i_5 += mesh.isolatedVertexNormals.length;

            bool_6 |= mesh.faceTypes != null;
            if (mesh.facePriorities)
                bool_7 = true;
            else {
                if (priority == -1)
                    priority = mesh.priority;

                if (priority != mesh.priority)
                    bool_7 = true;
            }

            hasFaceAlphas |= mesh.faceAlphas != null;
            hasTexturePos |= mesh.texturePos != null;
            hasFaceTextures |= mesh.faceTextures != null;
            hasTextureSkins |= mesh.textureSkins != null;

        }

        this.vertexX = [];
        this.vertexY = [];
        this.vertexZ = [];
        this.vertexSkins = [];
        this.aShortArray1980 = [];
        this.triangleX = [];
        this.triangleY = [];
        this.triangleZ = [];
        if (bool_6)
            this.faceTypes = [];

        if (bool_7)
            this.facePriorities = [];

        if (hasFaceAlphas)
            this.faceAlphas = [];

        if (hasTexturePos)
            this.texturePos = [];

        this.faceColours = [];
        if (hasFaceTextures)
            this.faceTextures = [];
    }

    decodeNewFormat() {
        let first = new InStream(this.data);
        let second = new InStream(this.data);
        let third = new InStream(this.data);
        let fourth = new InStream(this.data);
        let fifth = new InStream(this.data);
        let sixth = new InStream(this.data);
        let seventh = new InStream(this.data);

        first.setOffset(first.array.length - 23);

        this.vertexCount = first.readUnsignedShort();
        this.faceCount = first.readUnsignedShort();
        this.texturedFaceCount = first.readUnsignedByte();

        let flag = first.readUnsignedByte();
        let hasFaceRenderTypes = (flag & 0x1) === 1;
        let hasParticleEffects = (flag & 0x2) === 2;
        let hasBillboards = (flag & 0x4) === 4;
        let hasVersion = (flag & 0x8) === 8;
        if (hasVersion) {
            first.setOffset(first.getOffset() - 7);
            this.version = first.readUnsignedByte();
            first.setOffset(first.getOffset() + 6);
        }

        let modelPriority = first.readUnsignedByte();
        let hasFaceAlpha = first.readUnsignedByte();
        let hasFaceSkins = first.readUnsignedByte();
        let hasFaceTextures = first.readUnsignedByte();
        let hasVertexSkins = first.readUnsignedByte();
        let modelVerticesX = first.readUnsignedShort();
        let modelVerticesY = first.readUnsignedShort();
        let modelVerticesZ = first.readUnsignedShort();
        let faceIndices = first.readUnsignedShort();
        let textureIndices = first.readUnsignedShort();
        let numVertexSkins = 0;
        let i_25 = 0;
        let i_26 = 0;
        if (this.texturedFaceCount > 0) {
            this.textureRenderTypes = [];
            first.setOffset(0);

            for (let i = 0; i < this.texturedFaceCount; i++) {
                let b_28 = this.textureRenderTypes[i] = first.readByte();
                if (b_28 == 0)
                    numVertexSkins++;

                if (b_28 >= 1 && b_28 <= 3)
                    i_25++;

                if (b_28 == 2)
                    i_26++;
            }
        }

        let totalFaces = this.texturedFaceCount;

        let flagBufferOffset = totalFaces;
        totalFaces += this.vertexCount;

        let i_29 = totalFaces;
        if (hasFaceRenderTypes)
            totalFaces += this.faceCount;

        let i_30 = totalFaces;
        totalFaces += this.faceCount;
        let i_31 = totalFaces;
        if (modelPriority == 255)
            totalFaces += this.faceCount;

        let i_32 = totalFaces;
        if (hasFaceSkins == 1)
            totalFaces += this.faceCount;

        let vertSkinsBufferOffset = totalFaces;
        if (hasVertexSkins == 1)
            totalFaces += this.vertexCount;

        let i_34 = totalFaces;
        if (hasFaceAlpha == 1)
            totalFaces += this.faceCount;

        //totalfaces should be like +200 here
        let i_35 = totalFaces;
        totalFaces += faceIndices;

        let i_36 = totalFaces;
        if (hasFaceTextures == 1)
            totalFaces += this.faceCount * 2;

        let i_37 = totalFaces;
        totalFaces += textureIndices;

        let i_38 = totalFaces;
        totalFaces += this.faceCount * 2;

        let vertXBufferOffset = totalFaces;
        totalFaces += modelVerticesX;

        let vertYBufferOffset = totalFaces;
        totalFaces += modelVerticesY;

        let vertZBufferOffset = totalFaces;
        totalFaces += modelVerticesZ;

        let simpleTextPMNOffset = totalFaces;
        totalFaces += numVertexSkins * 6;

        let i_43 = totalFaces;
        totalFaces += i_25 * 6;
        let b_44 = 6;
        if (this.version === 14)
            b_44 = 7;
        else if (this.version >= 15)
            b_44 = 9;

        let i_45 = totalFaces;
        totalFaces += i_25 * b_44;

        let i_46 = totalFaces;
        totalFaces += i_25;

        let i_47 = totalFaces;
        totalFaces += i_25;

        let i_48 = totalFaces;
        totalFaces = i_26 * 2 + totalFaces + i_25;

        this.vertexX = [];
        this.vertexY = [];
        this.vertexZ = [];
        this.triangleX = [];
        this.triangleY = [];
        this.triangleZ = [];
        if (hasVertexSkins === 1)
            this.vertexSkins = [];

        if (hasFaceRenderTypes)
            this.faceTypes = [];

        if (modelPriority === 255)
            this.facePriorities = [];
        else
            this.priority = modelPriority;

        if (hasFaceAlpha === 1)
            this.faceAlphas = [];

        if (hasFaceSkins === 1)
            this.textureSkins = [];

        if (hasFaceTextures === 1)
            this.faceTextures = [];

        if (hasFaceTextures === 1 && this.texturedFaceCount > 0)
            this.texturePos = [];

        this.faceColours = [];
        if (this.texturedFaceCount > 0) {
            this.texTriX = [];
            this.texTriY = [];
            this.texTriZ = [];
            if (i_25 > 0) {
                this.particleDirectionX = [];
                this.particleDirectionY = [];
                this.particleDirectionZ = [];
                this.particleLifespanX = [];
                this.particleLifespanY = [];
                this.particleLifespanZ = [];
            }

            if (i_26 > 0) {
                this.texturePrimaryColour = [];
                this.textureSecondaryColour = [];
            }
        }

        first.setOffset(flagBufferOffset);
        second.setOffset(vertXBufferOffset);
        third.setOffset(vertYBufferOffset);
        fourth.setOffset(vertZBufferOffset);
        fifth.setOffset(vertSkinsBufferOffset);

        let baseX = 0;
        let baseY = 0;
        let baseZ = 0;

        for (let vertex = 0; vertex < this.vertexCount; vertex++) {
            let offsetFlags = first.readUnsignedByte();
            let vertexOffsetX = 0;
            if ((offsetFlags & 0x1) != 0)
                vertexOffsetX = second.readUnsignedSmart2();

            let vertexOffsetY = 0;
            if ((offsetFlags & 0x2) != 0)
                vertexOffsetY = third.readUnsignedSmart2();

            let vertexOffsetZ = 0;
            if ((offsetFlags & 0x4) != 0)
                vertexOffsetZ = fourth.readUnsignedSmart2();

            baseX += vertexOffsetX;
            baseY += vertexOffsetY;
            baseZ += vertexOffsetZ;
            this.vertexX[vertex] = baseX;
            this.vertexY[vertex] = baseY;
            this.vertexZ[vertex] = baseZ;
            if (hasVertexSkins === 1)
                this.vertexSkins[vertex] = fifth.readUnsignedByte();
        }

        first.setOffset(i_38);
        second.setOffset(i_29);
        third.setOffset(i_31);
        fourth.setOffset(i_34);
        fifth.setOffset(i_32);
        sixth.setOffset(i_36);
        seventh.setOffset(i_37);

        for (let face = 0; face < this.faceCount; face++) {
            this.faceColours[face] = first.readUnsignedShort();
            if (hasFaceRenderTypes)
                this.faceTypes[face] = second.readByte();

            if (modelPriority === 255)
                this.facePriorities = third.readByte();

            if (hasFaceAlpha === 1)
                this.faceAlphas[face] = fourth.readByte();

            if (hasFaceSkins === 1)
                this.textureSkins[face] = fifth.readUnsignedByte();

            if (hasFaceTextures === 1)
                this.faceTextures[face] = sixth.readUnsignedShort() - 1;

            if (this.texturePos) {
                if (this.faceTextures[face] != -1)
                    this.texturePos[face] = seventh.readUnsignedByte() - 1;
                else
                    this.texturePos[face] = -1;
            }
        }

        this.maxDepth = -1;
        first.setOffset(i_35);
        second.setOffset(i_30);
        this.calculateMaxDepth(first, second);
        first.setOffset(simpleTextPMNOffset);
        second.setOffset(i_43);
        third.setOffset(i_45);
        fourth.setOffset(i_46);
        fifth.setOffset(i_47);
        sixth.setOffset(i_48);
        this.decodeTexturedTriangles(first, second, third, fourth, fifth, sixth);
        first.setOffset(totalFaces);
        if (hasParticleEffects) {
            let emitterCount = first.readUnsignedByte();
            if (emitterCount > 0) {
                this.particleConfigs = [];
                for (let i = 0; i < emitterCount; i++) {
                    let id = first.readUnsignedShort();
                    let faceIndex = first.readUnsignedShort();
                    let priority;
                    if (modelPriority === 255)
                        priority = this.facePriorities[faceIndex];
                    else
                        priority = modelPriority;
                    this.particleConfigs[i] = {
                        id,
                        triangleX: this.triangleX[faceIndex],
                        triangleY: this.triangleY[faceIndex],
                        triangleZ: this.triangleZ[faceIndex],
                        priority
                    }
                }
            }

            let surfaceSkinCount = first.readUnsignedByte();
            if (surfaceSkinCount > 0) {
                this.surfaceSkins = [];
                for (let i = 0; i < surfaceSkinCount; i++) {
                    let x = first.readUnsignedShort();
                    let y = first.readUnsignedShort();
                    this.surfaceSkins[i] = { x, y };
                }
            }
        }

        if (hasBillboards) {
            let vertexCount = first.readUnsignedByte();
            if (vertexCount > 0) {
                this.isolatedVertexNormals = [];
                for (let i = 0; i < vertexCount; i++) {
                    let vertexOffsetX = first.readUnsignedShort();
                    let vertexOffsetY = first.readUnsignedShort();
                    let vertexOffsetZ = first.readUnsignedByte();
                    let b_58 = first.readByte();
                    this.isolatedVertexNormals[i] = {
                        vertexOffsetX,
                        vertexOffsetY,
                        vertexOffsetZ,
                        b_58
                    }
                }
            }
        }
    }

    decodeOldFormat() {
        let bool_2 = false;
        let bool_3 = false;
        let first = new InStream(this.data);
        let second = new InStream(this.data);
        let third = new InStream(this.data);
        let fourth = new InStream(this.data);
        let fifth = new InStream(this.data);
        first.setOffset(this.data.length - 18);
        this.vertexCount = first.readUnsignedShort();
        this.faceCount = first.readUnsignedShort();
        this.texturedFaceCount = first.readUnsignedByte();
        let i_9 = first.readUnsignedByte();
        let i_10 = first.readUnsignedByte();
        let i_11 = first.readUnsignedByte();
        let i_12 = first.readUnsignedByte();
        let i_13 = first.readUnsignedByte();
        let i_14 = first.readUnsignedShort();
        let i_15 = first.readUnsignedShort();
        let i_16 = first.readUnsignedShort();
        let i_17 = first.readUnsignedShort();
        let b_18 = 0;
        let i_42 = b_18 + this.vertexCount;
        let i_20 = i_42;
        i_42 += this.faceCount;
        let i_21 = i_42;
        if (i_10 == 255) {
            i_42 += this.faceCount;
        }

        let i_22 = i_42;
        if (i_12 == 1) {
            i_42 += this.faceCount;
        }

        let i_23 = i_42;
        if (i_9 == 1) {
            i_42 += this.faceCount;
        }

        let i_24 = i_42;
        if (i_13 == 1) {
            i_42 += this.vertexCount;
        }

        let i_25 = i_42;
        if (i_11 == 1) {
            i_42 += this.faceCount;
        }

        let i_26 = i_42;
        i_42 += i_17;
        let i_27 = i_42;
        i_42 += this.faceCount * 2;
        let i_28 = i_42;
        i_42 += this.texturedFaceCount * 6;
        let i_29 = i_42;
        i_42 += i_14;
        let i_30 = i_42;
        i_42 += i_15;
        this.vertexX = [];
        this.vertexY = [];
        this.vertexZ = [];
        this.triangleX = [];
        this.triangleY = [];
        this.triangleZ = [];
        if (this.texturedFaceCount > 0) {
            this.textureRenderTypes = [];
            this.texTriX = [];
            this.texTriY = [];
            this.texTriZ = [];
        }

        if (i_13 == 1)
            this.vertexSkins = [];

        if (i_9 == 1) {
            this.faceTypes = [];
            this.texturePos = [];
            this.faceTextures = [];
        }

        if (i_10 == 255)
            this.facePriorities = [];
        else
            this.priority = i_10;

        if (i_11 == 1)
            this.faceAlphas = [];

        if (i_12 == 1)
            this.textureSkins = [];

        this.faceColours = [];
        first.setOffset(b_18);
        second.setOffset(i_29);
        third.setOffset(i_30);
        fourth.setOffset(i_42);
        fifth.setOffset(i_24);
        let baseX = 0;
        let baseY = 0;
        let baseZ = 0;

        let face;
        let i_36;
        let vertexOffsetZ;
        for (face = 0; face < this.vertexCount; face++) {
            i_36 = first.readUnsignedByte();
            let vertexOffsetX = 0;
            if ((i_36 & 0x1) != 0)
                vertexOffsetX = second.readUnsignedSmart2();

            let vertexOffsetY = 0;
            if ((i_36 & 0x2) != 0)
                vertexOffsetY = third.readUnsignedSmart2();

            vertexOffsetZ = 0;
            if ((i_36 & 0x4) != 0)
                vertexOffsetZ = fourth.readUnsignedSmart2();

            this.vertexX[face] = baseX + vertexOffsetX;
            this.vertexY[face] = baseY + vertexOffsetY;
            this.vertexZ[face] = baseZ + vertexOffsetZ;
            baseX = this.vertexX[face];
            baseY = this.vertexY[face];
            baseZ = this.vertexZ[face];
            if (i_13 == 1)
                this.vertexSkins[face] = fifth.readUnsignedByte();
        }

        first.setOffset(i_27);
        second.setOffset(i_23);
        third.setOffset(i_21);
        fourth.setOffset(i_25);
        fifth.setOffset(i_22);

        for (face = 0; face < this.faceCount; face++) {
            this.faceColours[face] = first.readUnsignedShort();
            if (i_9 == 1) {
                i_36 = second.readUnsignedByte();
                if ((i_36 & 0x1) == 1) {
                    this.faceTypes[face] = 1;
                    bool_2 = true;
                } else
                    this.faceTypes[face] = 0;

                if ((i_36 & 0x2) == 2) {
                    this.texturePos[face] = (i_36 >> 2);
                    this.faceTextures[face] = this.faceColours[face];
                    this.faceColours[face] = 127;
                    if (this.faceTextures[face] != -1)
                        bool_3 = true;
                } else {
                    this.texturePos[face] = -1;
                    this.faceTextures[face] = -1;
                }
            }

            if (i_10 == 255)
                this.facePriorities[face] = third.readByte();

            if (i_11 == 1)
                this.faceAlphas[face] = fourth.readByte();

            if (i_12 == 1)
                this.textureSkins[face] = fifth.readUnsignedByte();
        }

        this.maxDepth = -1;
        first.setOffset(i_26);
        second.setOffset(i_20);
        let x = 0;
        let y = 0;
        let z = 0;
        let s_46 = 0;

        let type;
        for (let face = 0; face < this.faceCount; face++) {
            type = second.readUnsignedByte();
            if (type == 1) {
                x = (first.readUnsignedSmart2() + s_46);
                y = (first.readUnsignedSmart2() + x);
                z = (first.readUnsignedSmart2() + y);
                s_46 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (x > this.maxDepth)
                    this.maxDepth = x;

                if (y > this.maxDepth)
                    this.maxDepth = y;

                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 2) {
                y = z;
                z = (first.readUnsignedSmart2() + s_46);
                s_46 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 3) {
                x = z;
                z = (first.readUnsignedSmart2() + s_46);
                s_46 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 4) {
                let s_41 = x;
                x = y;
                y = s_41;
                z = (first.readUnsignedSmart2() + s_46);
                s_46 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = s_41;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            }
        }

        ++this.maxDepth;
        first.setOffset(i_28);

        for (let face = 0; face < this.texturedFaceCount; face++) {
            this.textureRenderTypes[face] = 0;
            this.texTriX[face] = first.readUnsignedShort();
            this.texTriY[face] = first.readUnsignedShort();
            this.texTriZ[face] = first.readUnsignedShort();
        }

        if (this.texturePos != null) {
            let bool_47 = false;

            for (let face = 0; face < this.faceCount; face++) {
                let i_48 = this.texturePos[face] & 0xff;
                if (i_48 != 255) {
                    if (this.triangleX[face] == (this.texTriX[i_48] & 0xffff) && this.triangleY[face] == (this.texTriY[i_48] & 0xffff) && this.triangleZ[face] == (this.texTriZ[i_48] & 0xffff))
                        this.texturePos[face] = -1;
                    else
                        bool_47 = true;
                }
            }

            if (!bool_47)
                this.texturePos = null;
        }

        if (!bool_3)
            this.faceTextures = null;

        if (!bool_2)
            this.faceTypes = null;
    }

    decodeTexturedTriangles(first, second, third, fourth, fifth, sixth) {
        for (let face = 0; face < this.texturedFaceCount; face++) {
            let type = this.textureRenderTypes[face] & 0xFF;
            if (type === 0) {
                this.texTriX[face] = first.readUnsignedShort();
                this.texTriY[face] = first.readUnsignedShort();
                this.texTriZ[face] = first.readUnsignedShort();
            } else if (type === 1) {
                this.texTriX[face] = second.readUnsignedShort();
                this.texTriY[face] = second.readUnsignedShort();
                this.texTriZ[face] = second.readUnsignedShort();
                if (this.version < 15) {
                    this.particleDirectionX[face] = third.readUnsignedShort();
                    if (this.version < 14)
                        this.particleDirectionY[face] = third.readUnsignedShort();
                    else
                        this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionX[face] = third.readUnsignedShort();
                } else {
                    this.particleDirectionX[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionZ[face] = third.read24BitUnsignedInteger();
                }
                this.particleLifespanX[face] = fourth.readByte();
                this.particleLifespanY[face] = fifth.readByte();
                this.particleLifespanZ[face] = sixth.readByte();
            } else if (type === 2) {
                this.texTriX[face] = second.readUnsignedShort();
                this.texTriY[face] = second.readUnsignedShort();
                this.texTriZ[face] = second.readUnsignedShort();
                if (this.version < 15) {
                    this.particleDirectionX[face] = third.readUnsignedShort();
                    if (this.version < 14)
                        this.particleDirectionY[face] = third.readUnsignedShort();
                    else
                        this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionX[face] = third.readUnsignedShort();
                } else {
                    this.particleDirectionX[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionZ[face] = third.read24BitUnsignedInteger();
                }
                this.particleLifespanX[face] = fourth.readByte();
                this.particleLifespanY[face] = fifth.readByte();
                this.particleLifespanZ[face] = sixth.readByte();
                this.texturePrimaryColour[face] = sixth.readByte();
                this.textureSecondaryColour[face] = sixth.readByte();
            } else if (type === 3) {
                this.texTriX[face] = second.readUnsignedShort();
                this.texTriY[face] = second.readUnsignedShort();
                this.texTriZ[face] = second.readUnsignedShort();
                if (this.version < 15) {
                    this.particleDirectionX[face] = third.readUnsignedShort();
                    if (this.version < 14)
                        this.particleDirectionY[face] = third.readUnsignedShort();
                    else
                        this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionX[face] = third.readUnsignedShort();
                } else {
                    this.particleDirectionX[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionY[face] = third.read24BitUnsignedInteger();
                    this.particleDirectionZ[face] = third.read24BitUnsignedInteger();
                }

                this.particleLifespanX[face] = fourth.readByte();
                this.particleLifespanY[face] = fifth.readByte();
                this.particleLifespanZ[face] = sixth.readByte();
            }
        }
    }

    calculateMaxDepth(first, second) {
        let x = 0;
        let y = 0;
        let z = 0;
        let s_6 = 0;
        for (let face = 0; face < this.faceCount; face++) {
            let type = second.readUnsignedByte();
            if (type == 1) {
                x = first.readUnsignedSmart2() + s_6;
                y = first.readUnsignedSmart2() + x;
                z = first.readUnsignedSmart2() + y;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (x > this.maxDepth)
                    this.maxDepth = x;

                if (y > this.maxDepth)
                    this.maxDepth = y;

                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 2) {
                y = z;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 3) {
                x = z;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            } else if (type == 4) {
                let s_8 = x;
                x = y;
                y = s_8;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > this.maxDepth)
                    this.maxDepth = z;
            }
        }
        this.maxDepth++;
    }

    toThreeMesh(height) {
        let vertices = [];

        let hasAlpha = this.faceAlphas != null;
        let hasfaceTypess = this.faceTypes != null;

        let h = -height << 2;

        for (let i = 0; i < this.maxDepth; i++)
            this.vertexX[i] += h;

        for (let face = 0; face < this.faceCount; face++) {

            let alpha = hasAlpha ? this.faceAlphas[face] : 0;
            if (alpha == -1) continue;

            alpha = ~alpha & 0xFF;

            let faceTypes = hasfaceTypess ? this.faceTypes[face] & 0x3 : 0;

            let faceA, faceB, faceC;
            switch (faceTypes) {
                case 0:
                case 1:
                    faceA = this.triangleX[face];
                    faceB = this.triangleY[face];
                    faceC = this.triangleZ[face];
                    break;
                case 2:
                case 3:
                    faceA = this.texTriX[face];
                    faceB = this.texTriY[face];
                    faceC = this.texTriZ[face];
                    break;
                default:
                    throw new Error("Unknown face type: " + faceTypes);
            }

            let hsl = this.faceColours[face];
            let colour = hslToRGB(hsl);

            let r = colour >> 16 & 0xFF;
            let g = colour >> 8 & 0xFF;
            let b = colour & 0xFF;

            vertices.push({
                pos: [this.vertexX[faceA], this.vertexY[faceA], this.vertexZ[faceA]],
                norm: [faceA, faceB, faceC],
                colours: [r, g, b, alpha],
            });
            vertices.push({
                pos: [this.vertexX[faceB], this.vertexY[faceB], this.vertexZ[faceB]],
                norm: [faceA, faceB, faceC],
                colours: [r, g, b, alpha],
            });
            vertices.push({
                pos: [this.vertexX[faceC], this.vertexY[faceC], this.vertexZ[faceC]],
                norm: [faceA, faceB, faceC],
                colours: [r, g, b, alpha],
            });

        }

        let positions = [];
        let normals = [];
        let colours = [];
        for (let vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            colours.push(...vertex.colours);
        }

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(colours), 4, true));

        geometry.normalizeNormals();
        geometry.computeVertexNormals();

        // let material2 = new THREE.MeshStandardMaterial({
        //     color: 'red'
        // });
        let material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        let mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = Math.PI;

        return mesh;

    }

}