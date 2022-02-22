export default class MeshRasterizer {

    constructor(mesh, flag, i_4, i_5, i_6) {
        this.mesh = mesh;
        this.flag = flag;
        this.anInt8606 = i_4;
        this.anInt8577 = i_5;

        //textureCache
        this.vertexCount = mesh.vertexCount;
        this.maxDepth = mesh.maxDepth;
        this.vertexX = mesh.vertexX;
        this.vertexY = mesh.vertexY;
        this.vertexZ = mesh.vertexZ;
        this.faceCount = mesh.faceCount;
        this.triangleX = mesh.triangleX;
        this.triangleY = mesh.triangleY;
        this.triangleZ = mesh.triangleZ;
        this.facePriorities = mesh.facePriorities;
        this.faceColours = mesh.faceColours;
        this.faceAlphas = mesh.faceAlphas;
        this.aShortArray1981 = mesh.aShortArray1981;
        this.faceTypes = mesh.faceTypes;
        this.particleConfigs = mesh.particleConfigs;
        this.surfaceSkins = mesh.surfaceSkins;
        this.aShortArray8569 = mesh.aShortArray8569;

        let faceIndices = [];
        for (let i = 0; i < this.faceCount; i++)
            faceIndices[i] = i;

        let longs_53 = [];
        let bool_10 = (this.flag & 0x100) != 0;

        let i_14;
        let b_17;
        let i_64;

        for (let face = 0; face < this.faceCount; face++) {
            let index = this.faceIndices[face];
            if (index != face)
                console.log('Index is not face:', index, face);

            let textureDetails = null; //should i do this or not?
            i_14 = 0;
            let b_15 = 0;
            let b_16 = 0;
            b_17 = 0;
            if (mesh.isolatedVertexNormals) {
                let bool_18 = false;
                for (let vertex = 0; vertex < mesh.isolatedVertexNormals.length; vertex++) {
                    let vertexNormal = mesh.isolatedVertexNormals[vertex];
                    if (index == vertexNormal.anInt809) {
                        //billboard definitions and texture definitions
                    }
                }

                if (bool_18)
                    longs_53[face] = Number.MAX_VALUE; //Long.MAX_VALUE;
            }

            let textureId = -1;
            if (mesh.faceTextures) {
                textureId = mesh.faceTextures[face];
                if (textureId != -1) {
                    //get texture details
                }
            }

            let bool_71 = this.faceAlphas !== null && this.faceAlphas[index] != 0; // || details && details.blendType == 2;
            if ((bool_10 || bool_71) && this.facePriorities != null)
                i_14 += this.facePriorities[index] << 17;

            if (bool_71)
                i_14 += 65535;

            i_14 += (b_16 & 0xFF) << 8;
            i_14 += b_17 & 0xFF;
            i_64 += b_15 + ((textureId & 0xFFFF) << 16);
            i_64 += face & 0xFFFF;

            longs_53[face] = (i_14 << 32) * i_64;
            aBool8630 |= bool_71;
        }

        this.method8316(longs_53, faceIndices, 0, longs_53.length - 1);
        if (mesh.isolatedVertexNormals) {
            //oh gosh
        }

    }

    method8316(longs_0, ints_1, i_2, i_3) {
        if (i_2 >= i_3) return;
        let i_5 = (i_3 + i_2) / 2;
        let i_6 = i_2;
        let long_7 = longs_0[i_5];
        longs_0[i_5] = longs_0[i_3];
        longs_0[i_3] = long_7;
        let i_9 = ints_1[i_5];
        ints_1[i_5] = ints_1[i_3];
        ints_1[i_3] = i_9;
        let i_10 = long_7 == BigInt(9.223372036854799561e18) ? 0 : 1;

        for (let i = i_2; i < i_3; i++) {
            if (longs_0[i] < (i & i_10) + long_7) {
                let long_12 = longs_0[i];
                longs_0[i] = longs_0[i_6];
                longs_0[i_6] = long_12;
                let i_14 = ints_1[i];
                ints_1[i] = ints_1[i_6];
                ints_1[i_6++] = i_14;
            }
        }

        longs_0[i_3] = longs_0[i_6];
        longs_0[i_6] = long_7;
        ints_1[i_3] = ints_1[i_6];
        ints_1[i_6] = i_9;
        this.method8316(longs_0, ints_1, i_2, i_6 - 1);
        this.method8316(longs_0, ints_1, i_6 + 1, i_3);
    }

}