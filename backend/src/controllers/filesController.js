const supabase = require('../utils/supabaseClient');
const {downloadFile} = require('../utils/googleDriveServiceAccount');


// Save files metadata to Supabase database
const saveFilesToSupabase = async (files) => {
    try {
      const { data, error } = await supabase
        .from('google_drive_files') // Assuming you have a 'google_drive_files' table
        .upsert(files.map((file) => ({
          file_id: file.id,
          file_name: file.name,
          modified_time: file.modifiedTime,
          web_content_link: file.webContentLink
        })),
      {onConflict : ['file_id']})
  
      if (error) {
        throw error;
      }
  
      console.log('Files saved to Supabase:', data);
    } catch (error) {
      console.error('Error saving files to Supabase:', error);
      throw error;
    }
  };
  
  module.exports = {
    saveFilesToSupabase,
  };

  const getFiles = async (req, res) => {
    const { page = 1, pageSize = 10, sortColumn = 'file_name', sortDirection = 'asc', filter = '' } = req.query;
    console.log(page, pageSize, sortColumn, sortDirection, filter);

    try {
      const offset = (page - 1) * pageSize; // Calculate offset for pagination
  
      // Build the query
      let query = supabase
        .from('google_drive_files')
        .select('*', {count : 'exact'})
        .ilike('file_name', `%${filter}%`) // Filter by file_name (case-insensitive)
        .order(sortColumn, { ascending: sortDirection === 'asc' })
        .range(offset, offset + pageSize - 1); // Set range for pagination
  
      const { data, error, count } = await query;
      console.log(count);
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      // Calculate total pages based on count
      const totalPages = Math.ceil(count / pageSize) ? Math.ceil(count/pageSize) : 1;
  
      res.status(200).json({ files: data, totalPages , totalRecords : count});
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  // Handle the file download
const downloadFileController = async (req, res) => {
  const { fileId } = req.body;  // Get the file ID from the request body
  console.log(fileId);

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const {fileStream, fileName, mimeType} = await downloadFile(fileId);
    console.log(fileName, mimeType);
    // Set the appropriate headers for file download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    // Pipe the file stream to the response
    fileStream.pipe(res);

    fileStream.on('end', () => {
      console.log('File download completed');
    });

    fileStream.on('error', (err) => {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).send('Error accessing Google Drive');
  }
};

module.exports = {
    getFiles,
    saveFilesToSupabase,
    downloadFileController
}
