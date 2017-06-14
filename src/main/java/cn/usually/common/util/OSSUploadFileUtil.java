package cn.usually.common.util;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.DeleteObjectsRequest;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.ObjectMetadata;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.upload.TempFile;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

/**
* @author BoyJeffrey
* @createtime 2017-06-12
* @version v1.0.0
*/
public class OSSUploadFileUtil {

	private static final Log logger = Logs.get();

	 static String URL_FRONT_PRODUCTIMAGE = "http://newworklife-product-picture.oss-cn-shanghai.aliyuncs.com"; // 产品图访问地址前缀:需要3级域名

	public static String BUCKET_PRODUCT_PICTURE = "newworklife-product-picture"; // 产品图bucket
	private static String endpoint = "http://oss-cn-shanghai.aliyuncs.com";
	private static String accessKeyId = "LTAIV9Og32fXLDPH";
	private static String accessKeySecret = "S5u8LtYtr0Y0fZhYalRkViaxYj9Im7";
	private static OSSClient client = null;
	
    
    /**
     * 文件上传
     * @param bucketName
     * @param key
     * @param tf
	 * return oss url
     */
    public static String uploadFile(String bucketName, String key, TempFile tf){
    	String image_url_oss = "";
    	client = new OSSClient(endpoint, accessKeyId, accessKeySecret);
    	try {
    		ObjectMetadata meta = new ObjectMetadata();
    		meta.setContentLength(tf.getSize());
    		client.putObject(bucketName, key, tf.getInputStream(),meta);
			image_url_oss = URL_FRONT_PRODUCTIMAGE + "/" + key;
    		logger.info("图片"+image_url_oss+"上传成功");
		} catch (Exception e) {
			logger.error(e);
		}finally {
			if(client != null){
				client.shutdown();
			}
		}
    	return image_url_oss;
    }
    
    /**
     * 文件删除
     * @param bucketName
     * @param key
     */
    public static void deleteFile(String bucketName,String key){
    	client = new OSSClient(endpoint, accessKeyId, accessKeySecret);
    	try {
    		client.deleteObject(bucketName, key);
    		logger.info("图片"+key+"删除成功");
    	} catch (Exception e) {
    		logger.error(e);
    	}finally {
    		if(client != null){
    			client.shutdown();
    		}
    	}
    	
    }
    
    /**
     * 批量删除文件
     * @param bucketName
     * @param keys
     */
    public static void beatchDeleteFile(String bucketName,List<String> keys){
    	client = new OSSClient(endpoint, accessKeyId, accessKeySecret);
    	try {
    		client.deleteObjects(new DeleteObjectsRequest(bucketName).withKeys(keys));
    		logger.info("图片"+keys+"删除成功");
    	} catch (Exception e) {
    		logger.error(e);
    	}finally {
    		if(client != null){
    			client.shutdown();
    		}
    	}
    }
    
    /**
     * 文件下载
     * @param bucketName
     * @param key
     * @param response
     */
    public static void downloadFile(String bucketName,String key,HttpServletResponse response){
    	client = new OSSClient(endpoint, accessKeyId, accessKeySecret);
    	try {
    		OSSObject object = client.getObject(bucketName, key);
    		//获取输入流
    		InputStream objectContent = object.getObjectContent();
    		long length = object.getObjectMetadata().getContentLength();
    		
    		byte[] buffer = new byte[objectContent.available()];
    		objectContent.read(buffer);
    		objectContent.close();
    		//objectContent.reset();
    		response.addHeader("Content-Disposition", "attachment;filename=" + new String(key.replaceAll(" ", "").getBytes("utf-8"),"iso8859-1"));
		    response.addHeader("Content-Length", "" + length);
		    OutputStream os = new BufferedOutputStream(response.getOutputStream());
		    response.setContentType("application/octet-stream");
		    os.write(buffer);// 输出文件
		    os.flush();
		    os.close();
			
		} catch (Exception e) {
			logger.error(e);
		}finally {
			if(client != null){
				client.shutdown();
			}
		}
    }

}
