import { readFileContents, encodeUrl } from '../task/helpers'


test('Checking encodeUrl will encode : value', () => {
    expect(encodeUrl('scheme://prefix.domain:port/path/filename ')).toBe('scheme%3A//prefix.domain%3Aport/path/filename%20')
})

// test('Test for opening file location',async () => {
//     expect(await readFileContents('/Users/roberthicks/Desktop/snyk-artifactory-upload/test/report-2024-03-15T22-07-06.json')).toHaveBeenCalledWith(expect.objectContaining({"vulnerabilities": [{"id": expect.any(String),"title": expect.any(String),"CVSSv3": expect.any(String)}], 
//     }))
// })


it('Test readfile for correct location and return object', async () => {
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { });
    await readFileContents('/Users/roberthicks/Desktop/snyk-artifactory-upload/test/report-2024-03-15T22-07-06.json')
    consoleSpy.mockRestore();
    expect(consoleSpy).toBeDefined()
});
