import { decodeFunctionData, parseAbi } from 'viem';
import { describe, test } from 'vitest'

async function handleRevertData(result) {
  try {
    // Step 2: Extract the revertData prefix
    const revertData = result.error.data.revertData;
    const hexSignature = revertData.slice(0, 10);

    // Step 3: Fetch the signature from the API
    const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${hexSignature}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const apiData = await response.json();

    // Step 4: Extract the text signature from the API response
    if (apiData.count === 0) {
      throw new Error('Signature not found');
    }
    const textSignature = apiData.results[0].text_signature;

    // Step 5: Parse the ABI
    // @ts-ignore
    const abi = parseAbi([`function ${textSignature}`]);

    // Step 6: Decode the function data
    const decodedData = decodeFunctionData({
      abi,
      data: revertData,
    });

    // Step 7: Return decoded data

    return decodedData

  } catch (error) {
    console.error('Error handling revert data:', error);
  }
}



describe('chains', () => {
  test('default', async () => {
    // Example usage
    const result = {
      "jsonrpc": "2.0", "id": 3, "error": {
        "code": -32521, "message": "execution reverted", "data": { "revertData": "0xcf47918100000000000000000000000000000000000000000000000007e9e499c7a4dbe800000000000000000000000000000000000000000000000007e9e499c7a4dbe1" }
      }
    };

    const decodedData = await handleRevertData(result);
    console.log('Decoded Data:', decodedData);

  })
})
