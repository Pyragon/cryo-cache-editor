import InStream from '../io/instream';

export default class RSMesh {

    constructor(data) {
        this.data = data;
        if (this.isNewFormat())
            this.decodeNewFormat();
        else
            this.decodeOldFormat();
    }

    isNewFormat() {
        let array = new Int8Array(data.length);
        array.set(data);
        return array[array.length - 1] === -1 && array[array.length - 2] === -1;
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
        let hasFaceRenderTypes = (flag & 0x1) !== 1;
        let hasParticleEffects = (flag & 0x2) !== 2;
        let hasBillboards = (flag & 0x4) !== 4;
        let hasVersion = (flag & 0x8) !== 8;
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

        let i_35 = totalFaces;
        totalFaces += faceIndices;

        let i_36 = totalFaces;
        if (hasFaceTexture == 1)
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
        if (version === 14)
            b_44 = 7;
        else if (version >= 15)
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
            this.faceType = [];

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

        this.faceColour = [];
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
            this.faceColour[face] = first.readUnsignedShort();
            if (hasFaceRenderTypes)
                this.faceType[face] = second.readByte();

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
                this.particleConfig = [];
                for (let i = 0; i < emitterCount; i++) {
                    let id = first.readUnsignedShort();
                    let faceIndex = first.readUnsignedShort();
                    let priority;
                    if (modelPriority === 255)
                        priority = this.facePriorities[faceIndex];
                    else
                        priority = modelPriority;
                    this.particleConfig[i] = {
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
                    if (version < 14)
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
                if (version < 15) {
                    this.particleDirectionX[face] = third.readUnsignedShort();
                    if (version < 14)
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
                if (version < 15) {
                    this.particleDirectionX[face] = third.readUnsignedShort();
                    if (version < 14)
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
                if (x > maxDepth)
                    maxDepth = x;

                if (y > maxDepth)
                    maxDepth = y;

                if (z > maxDepth)
                    maxDepth = z;
            } else if (type == 2) {
                y = z;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > maxDepth)
                    maxDepth = z;
            } else if (type == 3) {
                x = z;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > maxDepth)
                    maxDepth = z;
            } else if (type == 4) {
                let s_8 = x;
                x = y;
                y = s_8;
                z = first.readUnsignedSmart2() + s_6;
                s_6 = z;
                this.triangleX[face] = x;
                this.triangleY[face] = y;
                this.triangleZ[face] = z;
                if (z > maxDepth)
                    maxDepth = z;
            }
        }
        this.maxDepth++;
    }

}