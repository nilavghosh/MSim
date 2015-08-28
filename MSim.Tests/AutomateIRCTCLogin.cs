using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.PhantomJS;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System.IO;
using System.Drawing;
using OpenQA.Selenium.Remote;
using System.Drawing.Imaging;
using System.Diagnostics;

namespace AutomateIRCTC
{
    [TestFixture]
    public class AutomateIRCTCLogin
    {
        private IWebDriver driver;
        private StringBuilder verificationErrors;
        private string baseURL;
        private bool acceptNextAlert = true;
        
        [SetUp]
        public void SetupTest()
        {
            driver = new FirefoxDriver();
            driver.Manage().Window.Size = new Size(1920, 1080);
            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(5));
            baseURL = "https://www.irctc.co.in/";
            verificationErrors = new StringBuilder();
        }
        
        [TearDown]
        public void TeardownTest()
        {
            try
            {
               // driver.Quit();
            }
            catch (Exception)
            {
                // Ignore errors if unable to close the browser
            }
            Assert.AreEqual("", verificationErrors.ToString());
        }
        
        [Test]
        public void TheAutomateIRCTCLoginTest()
        {
            driver.Navigate().GoToUrl(baseURL + "/eticketing/home");
            driver.FindElement(By.Id("usernameId")).Clear();
            driver.FindElement(By.Id("usernameId")).SendKeys("nilavbghos");
            driver.FindElement(By.Name("j_password")).Clear();
            driver.FindElement(By.Name("j_password")).SendKeys("nilavbghos");
            driver.FindElement(By.Name("j_captcha")).Clear();
            //WebElement barcodeImage = driver.findElement(By.id("barcode"));
            //File imageFile = WebElementExtender.captureElementPicture(barcodeImage);
            WebElementExtender.GetImage(driver);
            Process.Start(@"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe", @"C:\data\capta2.png c:\data\out");
            Thread.Sleep(1000);
            string key = System.IO.File.ReadAllLines(@"c:\data\out.txt")[0];
            key=key.Replace(" ","");
            driver.FindElement(By.Name("j_captcha")).SendKeys(key);
            Thread.Sleep(1000);
            driver.FindElement(By.Id("loginbutton")).Click();
        }
        private bool IsElementPresent(By by)
        {
            try
            {
                driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }
        
        private bool IsAlertPresent()
        {
            try
            {
                driver.SwitchTo().Alert();
                return true;
            }
            catch (NoAlertPresentException)
            {
                return false;
            }
        }
        
        private string CloseAlertAndGetItsText() {
            try {
                IAlert alert = driver.SwitchTo().Alert();
                string alertText = alert.Text;
                if (acceptNextAlert) {
                    alert.Accept();
                } else {
                    alert.Dismiss();
                }
                return alertText;
            } finally {
                acceptNextAlert = true;
            }
        }
    }


    public class WebElementExtender {
 
    /**
     * Gets a picture of specific element displayed on the page
     * @param element The element
     * @return File
     * @throws Exception
     */
    //public static File captureElementPicture(IWebElement element)
    //        {
 
    //    // get the WrapsDriver of the WebElement
    //    WrapsDriver wrapsDriver = (WrapsDriver) element;
 
    //    // get the entire screenshot from the driver of passed WebElement
    //    File screen = ((TakesScreenshot) wrapsDriver.getWrappedDriver())
    //            .getScreenshotAs(OutputType.FILE);
 
    //    // create an instance of buffered image from captured screenshot
    //    BufferedImage img = ImageIO.read(screen);
 
    //    // get the width and height of the WebElement using getSize()
    //    int width = element.Size.Width;
    //    int height = element.Size.Height;
 
    //    // create a rectangle using width and height
    //    Rectangle rect = new Rectangle(new Point(0,0), element.Size);
 
    //    // get the location of WebElement in a Point.
    //    // this will provide X & Y co-ordinates of the WebElement
    //    Point p = element.Location;
 
    //    // create image  for element using its location and size.
    //    // this will give image data specific to the WebElement
    //    BufferedImage dest = img.getSubimage(p.getX(), p.getY(), rect.width,
    //            rect.height);
 
    //    // write back the image data for element in File object
    //    ImageIO.write(dest, "png", screen);
 
    //    // return the File object containing image data
    //    return screen;
    //}
        public static void GetImage(IWebDriver driver)
        {
            RemoteWebElement remElement = (RemoteWebElement)driver.FindElement(By.Id("cimage"));
            Point location = remElement.LocationOnScreenOnceScrolledIntoView;

            int viewportWidth =  Convert.ToInt32(((IJavaScriptExecutor)driver).ExecuteScript("return document.documentElement.clientWidth"));
            int viewportHeight = Convert.ToInt32(((IJavaScriptExecutor)driver).ExecuteScript("return document.documentElement.clientHeight"));

            driver.SwitchTo();

            int elementLocation_X = location.X;
            int elementLocation_Y = location.Y;

            IWebElement img = driver.FindElement(By.Id("cimage"));

            int elementSize_Width = img.Size.Width;
            int elementSize_Height = img.Size.Height;

            Size s = new Size();
            s.Width = driver.Manage().Window.Size.Width;
            s.Height = driver.Manage().Window.Size.Height;

            Bitmap bitmap = new Bitmap(s.Width, s.Height);
            Graphics graphics = Graphics.FromImage(bitmap as Image);
            graphics.CopyFromScreen(0, 0, 0, 0, s);

            //bitmap.Save(@"c:\data\capta.png", System.Drawing.Imaging.ImageFormat.Png);
            
            ITakesScreenshot screenshotDriver = driver as ITakesScreenshot;
            Screenshot screenshot = screenshotDriver.GetScreenshot();
            screenshot.SaveAsFile(@"c:\data\capta.png", ImageFormat.Png);

            float y = (float)elementLocation_Y - 84 + (float)(s.Height - viewportHeight);

            RectangleF part = new RectangleF(elementLocation_X, y, elementSize_Width, elementSize_Height);

            Bitmap bmpobj = (Bitmap)Image.FromFile(@"c:\data\capta.png");
            Bitmap bn = bmpobj.Clone(part, bmpobj.PixelFormat);
            bn.Save(@"c:\data\capta2.png", System.Drawing.Imaging.ImageFormat.Png);
        }
}
}
