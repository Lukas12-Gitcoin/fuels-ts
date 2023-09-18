import { BN } from 'fuels';

import { SnippetProjectEnum } from '../../../projects';
import { createAndDeployContractFromProject } from '../../utils';

describe(__filename, () => {
  it('should successfully demonstrate typed arrays examples', async () => {
    using contract = await createAndDeployContractFromProject(SnippetProjectEnum.ECHO_U64_ARRAY);

    // #region arrays-1
    const numberArray: number[] = [1, 2, 3, 4, 5]; // in Sway: [u8; 5]

    const boolArray: boolean[] = [true, false, true]; // in Sway: [bool; 3]
    // #endregion arrays-1

    expect(numberArray).toHaveLength(5);
    expect(boolArray).toHaveLength(3);
  });

  it('should successfully execute echo u64 array contract call', async () => {
    using contract = await createAndDeployContractFromProject(SnippetProjectEnum.ECHO_U64_ARRAY);

    // #region arrays-2
    const u64Array = [10000000, 20000000];

    const { value } = await contract.functions.echo_u64_array(u64Array).simulate();

    expect(new BN(value[0]).toNumber()).toEqual(u64Array[0]);

    expect(new BN(value[1]).toNumber()).toEqual(u64Array[1]);
    // #endregion arrays-2
  });

  it('should throw an error for array length mismatch', async () => {
    using contract = await createAndDeployContractFromProject(SnippetProjectEnum.ECHO_U64_ARRAY);

    let error: unknown;
    try {
      // #region arrays-3
      // will throw error because the array length is not 2
      await contract.functions.echo_u64_array([10000000]).simulate();
      // #endregion arrays-3
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should throw an error for array type mismatch', async () => {
    using contract = await createAndDeployContractFromProject(SnippetProjectEnum.ECHO_U64_ARRAY);

    let error: unknown;
    try {
      // #region arrays-4
      // will throw error because the second element is not of type u64
      await contract.functions.echo_u64_array([10000000, 'a']).simulate();
      // #endregion arrays-4
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });
});
