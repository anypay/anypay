"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const lib_1 = require("../lib");
describe("Converting tx hex into payments", () => {
    it("Should input raw tx and transform it into payment structs", () => __awaiter(void 0, void 0, void 0, function* () {
        let hex = "010000000327482847042d68df97384ef2af06276ab71ebf5d212449ab53b9407a3ad8aed80a0000006b48304502210097029e4c7fb4bee5c94ef358cb9f8d5115bee2e4098dbb3538875d450adbb06b0220716d548b04017bb31f35c50daefa4a71e08ed218441d6f294a3bacdc2f186816412103ab89ae1f76d7dea6564db6f89646ea030511d0e2a29f4d2ecdb8418df5810a6affffffff6911505c813c362e92a490888c057a9a035f4f281eff9c33d7b1efe41f8346dd060000006b483045022100abb58fcbe673cc42d2b6acfd7c333a6cf94e16115390c7b6a87064794d18f5dc02207aac78e62348da2bb8f2f9da230da0d93646432ff55343eada3b23cdda0d39aa412102d47bbe92ba533c7d10d4add9b7cb8aca0d4571b4b4bcfe8b38cf4ae82a89815effffffff1e8834f0c1041eac325b5278457c943f8621718933e87403c6c3372959229d55090000006a47304402203460e168ecb2e457feb65f7212b43ab33a7f15450bfdf273719077608feae12b022067d7a3c8c10a50c9fc4fe05df0ef2611c700984d62caef5c65e229042241826a4121022cfe438142194f37218245479d66e7b9237a2d89f64aa738f310e74b187b69c0ffffffff0550c30000000000001976a9148fddccfa98d18c4bc9a6183a127c991dc031708988ac50c30000000000001976a91483900214ed22cf758166e5887fe602654199c2d788aca0860100000000001976a91483900214ed22cf758166e5887fe602654199c2d788ac48710000000000001976a91483900214ed22cf758166e5887fe602654199c2d788ac50400000000000001976a9146b19bc45358c0bd77f0fc7616e96fa2c915279fc88ac00000000";
        let payments = lib_1.transformHexToPayments(hex);
        assert.equal(payments[1].address, '1Cze2zS2Ss3Y8pdiAWFjLPbvbcuxu6UcMw');
        assert.equal(payments[1].amount, 0.00179);
        assert.equal(payments[1].currency, 'BSV');
        assert.equal(payments[1].hash, '3dcd1a80b7956447923720b90c24e2e52da6bd59874864065f3833b33ea0ff05');
        assert.equal(payments[2].address, '1AmJ8ezG2BPcxj473XLPCBsQzeqhRsnRgB');
        assert.equal(payments[2].amount, 0.00016464);
        assert.equal(payments[2].currency, 'BSV');
        assert.equal(payments[2].hash, '3dcd1a80b7956447923720b90c24e2e52da6bd59874864065f3833b33ea0ff05');
    }));
    it("Should input raw tx and transform it into payment structs", () => __awaiter(void 0, void 0, void 0, function* () {
        let hex = "0100000005751ca81d2043356c0fc51e91e08d24a1d2bef9342f471d3c0669fa46b8e09b52010000006b483045022100d0c37da81424330f91541a7fc3c12f20d5cdb609ccf307a1c80a203574df84ef0220643342846ef7655ae396386e97999bdeae2da0ff94e481678116aa4690841efe4121039c1c0d670f42fa81620a84c2de9630e157fe728461631416bf6904b4f62ac305ffffffff811dea5475dac2f54481a84cd7abd1e962f9da9c405d3869cf0242139f682e63000000006a473044022041ec060b7118ef52aa831d33f62ac580eb000e1a42f547709b5b038794c7a406022057dd2b794729a73a1f1142b2fd8d79c9ff9c0a2a76a19d748d00fc736c6e597c412102eece20fcc60375d9d1945a31e877bcfea08db2002d0d63889899c100ea6596e8ffffffffb76113066bd6958f1c586ac70b55996b55a99da34215b506677bf664c4700bce010000006a473044022002c3048c476a96213d87957ae04e9699796774d426d0e0b8ff6947c89028fc8502202d3d92e78fe4f7760af43409de4c1c2ffa371e2327a4552ad9f86f058893ee094121022f88944fbe1e0ea7a5dce5d05ec0f31f35dbf71aa43e4b87aa6ea644913aac19ffffffffc213951f7fe44a4cd15dda0af0439b6b7b631579b63a9821a1781d37cd08e6d3010000006b483045022100f5a1d0987c889ad0fd1f5f3267572069bbb1d99b5af5cde8111899a95ded6984022066123550a19dbcc3e203d9ad3b118aeabe1134a80c31064186f1916c5cb93481412103cae52df96b125023f5c19e4f1dc5854f224a1606c2b1aa4dd2091e9ff9ae7588ffffffff1f6fa5107f5bb99e56994e438fcf06a4dc55a2852bba991de7f9ab42a17d70d7010000006a47304402201ec80c52389e6aa9d2fb7e96ee3200643e7133f986d016f4704d235f1ee1c040022051dc5f17dd41cae9142be5bf5fe88c88bf107da33a39451386eeb06c7e8b1c0f4121029e07bc90d172791b9a9d2599aeba53f3826ee66e0ad8716df24bf55e05d77ebeffffffff022aa0fe00000000001976a914fc9b58f04dc69dc5b6ee8974ac74a9a64e3bc77988ac60e44902000000001976a914ac327bde0871f3c087d105b0138d07e671dbe58f88ac00000000";
        let payments = lib_1.transformHexToPayments(hex);
        assert.equal(payments.length, 2);
        assert.equal(payments[0].address, '1Q2fP519HKZkxL4Fp1J1SHy9aECpRj6KU2');
        assert.equal(payments[0].amount, 0.16687146);
        assert.equal(payments[0].currency, 'BSV');
        assert.equal(payments[0].hash, 'e60d81f7f5bf619787496f771cddee86e9d86b28e18fba152aec4a207e907475');
        assert.equal(payments[1].address, '1GhVhg8f54CXeafNNo2zSN7UXEG5wM6Nfi');
        assert.equal(payments[1].amount, 0.38397024);
        assert.equal(payments[1].currency, 'BSV');
        assert.equal(payments[1].hash, 'e60d81f7f5bf619787496f771cddee86e9d86b28e18fba152aec4a207e907475');
    }));
});
//# sourceMappingURL=payment_publisher_test.js.map