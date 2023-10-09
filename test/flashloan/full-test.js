const { resetForkToBlock } = require('../utils');
const { fullFLTest } = require('./fl-tests');

describe('Flashloans full test', () => {
    it('... should do full flashloan test', async () => {
        // console.log('hello')
        await resetForkToBlock();
        await fullFLTest();
    });
});
