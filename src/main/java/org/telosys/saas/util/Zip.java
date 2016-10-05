package org.telosys.saas.util;

import org.telosys.saas.domain.FolderToDownload;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * http://www.mkyong.com/java/how-to-compress-files-in-zip-format/
 */
public class Zip {
    static final int BUFFER = 2048;

    /**
     * A constants for buffer size used to read/write data
     */
    private static final int BUFFER_SIZE = 4096;

    /**
     * Compresses a collection of files to a destination zip file
     * @param listFiles A collection of files and directories
     * @param destZipFile The path of the destination zip file
     * @throws FileNotFoundException
     * @throws IOException
     */
    public void compressFiles(List<String> listFiles, String destZipFile) throws FileNotFoundException, IOException {

        ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(destZipFile));

        for (String pathFile : listFiles) {
            java.io.File file = new File(pathFile);
            if (file.isDirectory()) {
                addFolderToZip(file, file.getName(), zos);
            } else {
                addFileToZip(file, zos);
            }
        }

        zos.flush();
        zos.close();
    }

    /**
     * Adds a directory to the current zip output stream
     * @param folder the directory to be  added
     * @param parentFolder the path of parent directory
     * @param zos the current zip output stream
     * @throws FileNotFoundException
     * @throws IOException
     */
    private void addFolderToZip(File folder, String parentFolder,
                                ZipOutputStream zos) throws FileNotFoundException, IOException {
        for (File file : folder.listFiles()) {
            if (file.isDirectory()) {
                addFolderToZip(file, parentFolder + "/" + file.getName(), zos);
                continue;
            }

            zos.putNextEntry(new ZipEntry(parentFolder + "/" + file.getName()));

            BufferedInputStream bis = new BufferedInputStream(
                    new FileInputStream(file));

            long bytesRead = 0;
            byte[] bytesIn = new byte[BUFFER_SIZE];
            int read = 0;

            while ((read = bis.read(bytesIn)) != -1) {
                zos.write(bytesIn, 0, read);
                bytesRead += read;
            }

            zos.closeEntry();

        }
    }

    /**
     * Adds a file to the current zip output stream
     * @param file the file to be added
     * @param zos the current zip output stream
     * @throws FileNotFoundException
     * @throws IOException
     */
    private static void addFileToZip(File file, ZipOutputStream zos)
            throws FileNotFoundException, IOException {
        zos.putNextEntry(new ZipEntry(file.getName()));
        FileInputStream fileInputStream = new FileInputStream(file);
        BufferedInputStream bis = new BufferedInputStream(fileInputStream);
        byte[] bytesIn = new byte[BUFFER_SIZE];
        int read = 0;
        while ((read = bis.read(bytesIn)) != -1) {
            zos.write(bytesIn, 0, read);
        }
        zos.closeEntry();
    }



    public static void zip(String input, String output, FolderToDownload folderToDownload) {
        try {
            FileOutputStream dest = new FileOutputStream(output);
            ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
            List<String> files = new ArrayList<>();
            File f = new File(input);
            for (String sub : f.list()) {
                files.add(FileUtil.join(input, sub));
            }
            byte data[] = new byte[BUFFER];
            BufferedInputStream origin = null;
            int i = 0;
            while (i < files.size()) {
                String filePath = files.get(i);
                String fileRelativePath = filePath.substring(input.length() + File.separator.length());
                if ((fileRelativePath.contains("TelosysTools") && folderToDownload.getTelosysFolder()) || (!fileRelativePath.contains("TelosysTools") && folderToDownload.getGeneratedFiles())) {
                    System.out.println("Adding: " + filePath);
                    File file = new File(filePath);
                    if (file.isDirectory()) {
                        ZipEntry entry = new ZipEntry(fileRelativePath + File.separator);
                        out.putNextEntry(entry);
                        for (String sub : file.list()) {
                            files.add(FileUtil.join(filePath, sub));
                        }
                    }
                    if (file.isFile()) {
                        FileInputStream fi = new FileInputStream(filePath);
                        origin = new BufferedInputStream(fi, BUFFER);
                        ZipEntry entry = new ZipEntry(fileRelativePath);
                        out.putNextEntry(entry);
                        int count;
                        while ((count = origin.read(data, 0, BUFFER)) != -1) {
                            out.write(data, 0, count);
                        }
                        origin.close();
                    }
                }
                i++;
            }
            out.flush();
            out.close();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {

        }
    }

}