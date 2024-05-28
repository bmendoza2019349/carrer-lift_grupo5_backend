import mongoose from 'mongoose'

const moduleSchema = new mongoose.Schema( {
    nameModule: {
        type: String,
        required: [true, 'A name for this module is required'],
        unique: true,
    },

    archivos: [{
        type: String,
    }],
    descriptionModule: {
        type: String,
        required: [true, 'A description for this module is required'],
    },
    form: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
    }]

} );

moduleSchema.methods.addFormsById = async function ( formId ) {
    this.form.push( formId );
    await this.save();
}

moduleSchema.path( 'archivos' ).validate( ( val ) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test( val );
}, 'Invalid URL' );

export default mongoose.model( 'Module', moduleSchema )